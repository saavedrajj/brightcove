import custom_report_utils
import traceback

from datetime import datetime, timedelta

def generate_reports(date):

    # Next Interactive
    try: 
        custom_report_utils.run_daily_query_and_export_result_to_spreadsheet("next_interactive_medium_report_live_vs_vod",date,"1jSMcErg4QjpNirjDJgccAYPPmJlcfoxS_SWrSIPGYnQ",'UTC',6)
    except Exception as e:
        traceback.print_exc()
        pass
    try: 
        custom_report_utils.run_daily_query_and_export_result_to_spreadsheet("next_interactive_medium_report_videos",date,"1kM3rR5OP2WE_h8SsTJzdeiHz-fg4ikovyalqyNxtBPc",'UTC',6)
    except Exception as e:
        traceback.print_exc()
        pass

if __name__ == '__main__':
    # date = yesterday UTC
    date = datetime.utcnow() - timedelta(days=1)
    
    generate_reports(date)

    API Training Shop Blog About 

