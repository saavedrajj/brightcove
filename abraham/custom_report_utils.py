import sys
sys.path.append('/gc_utils')

import os
import googleapiclient.http as http
from bq_utils import submitBQJob,waitForBQJob
from google_services import get_service_with_json_creds
from datetime import datetime, timedelta
import pytz
import query_depository
import time
import csv

DEFAULT_CREDS_FILENAME = "/etc/secrets/tinman-secrets/tinman_utilities_key.json"
DEFAULT_PROJECT_ID = "brightcove-rna-master"
DEFAULT_DATASET_ID = "custom_reports"
DEFAULT_GCS_BUCKET = "brightcove_report_exports"
VERBOSE_COMMENTING = True

def form_query(query_name, date, timezone):
    offset_int_hrs = int(datetime.fromtimestamp(time.mktime(date.timetuple()), pytz.timezone(timezone)).strftime('%z'))/100
    date_from = date.strftime("%Y_%m_%d")
    date_to = date.strftime("%Y_%m_%d")
    if(offset_int_hrs > 0):
        date_yesterday = date - timedelta(days=1)
        date_from = date_yesterday.strftime("%Y_%m_%d")
    if(offset_int_hrs < 0):
        date_tomorrow = date + timedelta(days=1)
        date_to = date_tomorrow.strftime("%Y_%m_%d")
    
    return query_depository.queries[query_name] % (date_from, date_to, str(offset_int_hrs), date.strftime("%Y-%m-%d"))

def form_query_alt(query_name, date_from, date_to):    
    return query_depository.queries[query_name] % (date_from, date_to)

def execute_query(bq_service, 
                  table_id, 
                  query, 
                  project_id=DEFAULT_PROJECT_ID):
    jobCollection = bq_service.jobs()
    jobData = {
                   'projectId': project_id,
                   'configuration': {
                                     'query': {"useLegacySql"      : "false",
                                               "flattenResults"    : "true",
                                               "destinationTable"  : {
                                                                       "projectId" : project_id,
                                                                       "tableId"   : table_id,
                                                                       "datasetId" : DEFAULT_DATASET_ID,
                                                                     },
                                               "writeDisposition"  : "WRITE_TRUNCATE",
                                               "allowLargeResults" : "true",
                                               "createDisposition" : "CREATE_IF_NEEDED",
                                               "query"             : query
                                               }
                                     }
                   }
    if VERBOSE_COMMENTING:
        print("Executing the following query and writing the results to [custom_reports.%s]." % (table_id))
        print(query)

    job_id = submitBQJob(bq_service, jobData, project_id)
    waitForBQJob(bq_service, job_id, project_id)

def export_table(bq_service,
                 table_id,
                 dataset_id=DEFAULT_DATASET_ID,
                 project_id=DEFAULT_PROJECT_ID,
                 export_format="CSV",
                 num_retries=5,
                 compression="NONE"):

    filename = table_id + ".csv"
    cloud_storage_path = "gs://" + DEFAULT_GCS_BUCKET + "/" + dataset_id + "/" + filename

    job_data = {
        'jobReference': {
            'projectId': project_id
        },
        'configuration': {
            'extract': {
                'sourceTable': {
                    'projectId': project_id,
                    'datasetId': dataset_id,
                    'tableId': table_id,
                },
                'destinationUris': [cloud_storage_path],
                'destinationFormat': export_format,
                'compression': compression
            }
        }
    }

    if VERBOSE_COMMENTING:
        print("Archiving [%s.%s] to %s." % (dataset_id, table_id, cloud_storage_path)) 

    job_id = submitBQJob(bq_service, job_data)
    waitForBQJob(bq_service, job_id, project_id)
    return filename

def download_file_from_gcs(gcs_service, bucket, path, filename):
    if VERBOSE_COMMENTING:
        print("Downloading file %s to local folder." % ("gs://"+bucket+"/"+path + "/" + filename))
    req = gcs_service.objects().get_media(bucket=bucket, object=(path + "/" + filename))
    
    filehandle = open(filename, 'w')
    downloader = http.MediaIoBaseDownload(filehandle, req)

    done = False
    while done is False:
        status, done = downloader.next_chunk()
        if VERBOSE_COMMENTING:
            print("Download {}%.".format(int(status.progress() * 100)))
    
    filehandle.close()

def get_row_and_col_counts_from_csv(filename):
    d = ','
    f=open(filename,'r')

    reader=csv.reader(f,delimiter=d)
    ncol=len(next(reader)) # Read first line and count columns
    f.seek(0)              # go back to beginning of file
    nrow=0
    for row in reader:
        nrow+=1
    return [nrow+1,ncol+1]

def upload_file_to_drive(drive_service, filename, sheetname):
    requestBody = {'name': sheetname, 'mimeType': 'application/vnd.google-apps.spreadsheet'}
    
    resultSheetId = ""
    resp = drive_service.files().create(body=requestBody, media_body=filename).execute()
    if resp:
        print('Uploaded %r to Google Drive file %r (as %s). Retrieving spreadsheetId.' % (filename, sheetname, resp['mimeType']))
        resultSheetId = resp.get("id")
        print(resultSheetId)
        
    return resultSheetId

def remove_empty_rows_and_cols(sheets_service, spreadsheetIdSource, nrow, ncol):
    if VERBOSE_COMMENTING:
        print("Deleting empty rows and cols from sheet %s." % (spreadsheetIdSource))
    resp = sheets_service.spreadsheets().get(spreadsheetId=spreadsheetIdSource).execute()
    sheetIdSource = resp.get('sheets',[])[0].get('properties').get('sheetId')
    sheetBody = {'requests': [{'deleteDimension':{'range':{'sheetId':sheetIdSource, 'dimension': "ROWS", 'startIndex':nrow}}}]}
    resp = sheets_service.spreadsheets().batchUpdate(spreadsheetId=spreadsheetIdSource, body=sheetBody).execute()
    sheetBody = {'requests': [{'deleteDimension':{'range':{'sheetId':sheetIdSource, 'dimension': "COLUMNS", 'startIndex':ncol}}}]}
    resp = sheets_service.spreadsheets().batchUpdate(spreadsheetId=spreadsheetIdSource, body=sheetBody).execute()

def copy_and_rename_sheet(sheets_service, spreadsheetIdSource, spreadsheetIdTarget, newSheetTitle):
    resp = sheets_service.spreadsheets().get(spreadsheetId=spreadsheetIdSource).execute()
    if VERBOSE_COMMENTING:
        print("Copying new spreadsheet %s to target spreadsheet %s." % (spreadsheetIdSource, spreadsheetIdTarget))
        print("Renaming new sheet to %s." % (newSheetTitle))
    if resp:
        sheetIdSource = resp.get('sheets',[])[0].get('properties').get('sheetId')
        if VERBOSE_COMMENTING:
            print("Retrieving source sheetId from source spreadsheet %s." % (spreadsheetIdSource))
            print(sheetIdSource)
    
    #rsp = google_service.spreadsheets().batchUpdate(spreadsheetId=sheetId, body=sheetBody).execute()
    resp = sheets_service.spreadsheets().sheets().copyTo(spreadsheetId=spreadsheetIdSource,sheetId=sheetIdSource,body={"destinationSpreadsheetId":spreadsheetIdTarget}).execute()
    if resp:
        sheetIdTarget = resp.get('sheetId')
        if VERBOSE_COMMENTING:
            print("Copied sheet %s from spreadsheet %s to spreadsheet %s. Retrieving resulting sheetId." % (sheetIdSource, spreadsheetIdSource, spreadsheetIdTarget))
            print(sheetIdTarget)
        
    sheetBody = {'requests': [{'updateSheetProperties':{'properties':{'title':newSheetTitle,'index':0,'sheetId':sheetIdTarget},'fields':"title,index"}}]}
    resp = sheets_service.spreadsheets().batchUpdate(spreadsheetId=spreadsheetIdTarget, body=sheetBody).execute()
    if resp:
        if VERBOSE_COMMENTING:
            print("Renamed sheet with ID %s in spreadsheet %s to %s." % (sheetIdTarget, spreadsheetIdTarget, newSheetTitle))

def delete_file_from_drive(drive_service, sheetId):
    resp = drive_service.files().delete(fileId=sheetId).execute()
    if VERBOSE_COMMENTING:
        print("Deleted %s from Google Drive." % (sheetId))

def delete_local_file(filename):
    os.remove(filename)
    if VERBOSE_COMMENTING:
        print("Deleted file %s from local folder." % (filename))

def run_daily_query_and_export_result_to_spreadsheet(query_name, date, spreadsheetIdTarget, timezone='UTC', days_range=0):
    # Consider revising.
    if(days_range == 0):
        query = form_query(query_name, date, timezone)
    else:
        date_from = (date - timedelta(days=days_range)).strftime("%Y_%m_%d")
        date_to = date.strftime("%Y_%m_%d")
        query = form_query_alt(query_name, date_from, date_to)
    
    # Run query and export result to GCS.
    table_id = query_name + "_" + date.strftime("%Y_%m_%d")

    bq_service = get_service_with_json_creds('bigquery', 'v2', DEFAULT_CREDS_FILENAME)

    execute_query(bq_service, table_id, query)
    filename = export_table(bq_service, table_id)
    
    # Download result from GCS.
    gcs_service = get_service_with_json_creds('storage', 'v1', DEFAULT_CREDS_FILENAME)    
    download_file_from_gcs(gcs_service, DEFAULT_GCS_BUCKET, DEFAULT_DATASET_ID, filename)
    
    # Read csv to get row & col counts in order to strip empty cells in the spreadsheet.
    nrowscols = get_row_and_col_counts_from_csv(filename)

    # Upload csv file to Google Drive.
    drive_service = get_service_with_json_creds('drive', 'v3', DEFAULT_CREDS_FILENAME)
    spreadsheetIdSource = upload_file_to_drive(drive_service, filename, table_id)

    # Copy sheet to main spreadsheet. Remove empty cells. Rename and reorder new sheet.
    sheets_service = get_service_with_json_creds('sheets', 'v4', DEFAULT_CREDS_FILENAME)
    remove_empty_rows_and_cols(sheets_service, spreadsheetIdSource, nrowscols[0]-1, nrowscols[1]-1)
    copy_and_rename_sheet(sheets_service, spreadsheetIdSource, spreadsheetIdTarget, date.strftime("%Y_%m_%d"))
    
    # Clean up.
    delete_file_from_drive(drive_service, spreadsheetIdSource)
delete_local_file(filename)