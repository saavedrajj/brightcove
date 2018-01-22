import custom_report_utils
import traceback

from datetime import datetime, timedelta

def generate_reports(date):
    # EXAMPLE
    try:
        custom_report_utils.run_daily_query_and_export_result_to_spreadsheet("acc_2540076170001_views_by_domain",date,"142wD1T9D3IAYcPp3mGyaeltTMTNMrqjloPTDA-bBllU","Europe/London")
        #custom_report_utils.run_daily_query_and_export_result_to_spreadsheet("next_interactive_medium_report_live_vs_vod",date,"1jSMcErg4QjpNirjDJgccAYPPmJlcfoxS_SWrSIPGYnQ",'UTC',6)
        #custom_report_utils.run_daily_query_and_export_result_to_spreadsheet("next_interactive_medium_report_videos",date,"1kM3rR5OP2WE_h8SsTJzdeiHz-fg4ikovyalqyNxtBPc",'UTC',6)
    except Exception as e:
        traceback.print_exc()
        pass

if __name__ == '__main__':
    #date = datetime.utcnow() - timedelta(days=1)
    date = datetime(2017, 11, 26, 0, 0)
    
generate_reports(date)