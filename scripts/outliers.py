import pandas as pd
import numpy as np

def year_filter(df):
    _filters = ["YearsCode","YearsCodePro"]
    new_df=df
    for _filter in _filters:
        new_df = new_df[new_df[_filter].notna()]
        new_df = new_df.loc[new_df[_filter]!='More than 50 years']
        new_df.replace({_filter: {"Less than 1 year": '0'}},inplace=True)
        new_df["YearsCode"]= new_df[_filter].astype(int)
    return new_df
    
def workweekhrs(new_df):
    _filter = "WorkWeekHrs"
    new_df = new_df.loc[new_df[_filter]<130]
    return new_df

if __name__ == "__main__":
    path="../Data/merged_data.csv"
    df=pd.read_csv(path)
    new_df=year_filter(df)
    new_df=workweekhrs(new_df)
    new_df.to_csv("./../Data/merged_data_1.csv",na_rep='N/A')