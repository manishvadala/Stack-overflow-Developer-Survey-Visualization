import os
import pandas as pd
from glob import glob

def extract_technologies(df,year,key,filters=[]):
    df = df[df[key].notna()]
    print(df.shape)
    langs = df[key].astype(str)
    print(len(langs))
    all_langs=[]
    mp={}
    for lang in langs:
        l_lang=lang.split(";")
        for lang in l_lang:
            if lang not in mp:
                mp[lang]=0
            else:
                mp[lang]+=1

    print(key+'for the year : '+year)
    mp=dict(sorted(mp.items(), key=lambda item: item[1]))
    print(mp)

if __name__ == "__main__":
    path="./../Data/"
    years=["2019","2020"]
    _filters={
        "Country":"India",
        "Age":30
    }
    for year in years:
        _data_path = os.path.join(path,"developer_survey_"+year,"survey_results_public_"+year+".csv")
        df=pd.read_csv(_data_path)
        for _filter in _filters:
            df = df[df[_filter].notna()]
            df = df.loc[df[_filter] == _filters[_filter]]
        extract_technologies(df,year,key="LanguageWorkedWith")
        #extract_technologies(df,year,key="DatabaseWorkedWith")
        #extract_technologies(df,year,"WebframeWorkedWith")