import custom_report_utils
import traceback

from datetime import datetime, timedelta

def generate_reports(date):

    # EXPRESS (2540076170001)
    try: 
        custom_report_utils.run_daily_query_and_export_result_to_spreadsheet("acc_2540076170001_top_3_videos_by_domain",date,"1LUC02GHHmHYNvHmkLEBkIF5Lbbp_3jTNKgg3sLiMq5k","Europe/London")
    except Exception as e:
        traceback.print_exc()
        pass
    try: 
        custom_report_utils.run_daily_query_and_export_result_to_spreadsheet("acc_2540076170001_views_by_country",date,"1UqwXOB65DKz75u9HEV-6spTxMQGpCVn_ZTV0Iij_6iQ","Europe/London")
    except Exception as e:
        traceback.print_exc()
        pass
    try: 
        custom_report_utils.run_daily_query_and_export_result_to_spreadsheet("acc_2540076170001_views_by_domain",date,"1ydFx_CSBfwNVoYfqrHJspYb7Ag7Bl5HT59n95txFgic","Europe/London")
    except Exception as e:
        traceback.print_exc()
        pass

if __name__ == '__main__':
    # date = yesterday UTC
    date = datetime.utcnow() - timedelta(days=1)
    
generate_reports(date)