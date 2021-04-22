import pandas as pd
import numpy as np

def process(paths):
    data_frame=[]
    for i in range(0,len(paths)):
        path=paths[i]
        year = path.split("_")[-1][:-4]
        df=pd.read_csv(path)
        df.insert(2, "year", [year]*df.shape[0], True)
        col_names = [
        'year','Age', 'Age1stCode', 'CompFreq',
        'CompTotal', 'ConvertedComp', 'Country', 'CurrencyDesc',
        'CurrencySymbol', 'DatabaseDesireNextYear', 'DatabaseWorkedWith',
        'DevType', 'EdLevel', 'Gender',
        'JobSat', 'JobSeek', 'LanguageDesireNextYear', 'LanguageWorkedWith',
        'MiscTechDesireNextYear', 'MiscTechWorkedWith', 'OrgSize', 'PlatformDesireNextYear',
        'PlatformWorkedWith', 'UndergradMajor', 'WebframeDesireNextYear',
        'WebframeWorkedWith','WorkWeekHrs', 'YearsCode',
        'YearsCodePro'
        ]
        df=df.reindex(columns=col_names)
        df = df[col_names]
        #df.to_csv("./../Data/new_data"+str(year)+".csv")
        sampled_data = df #df.sample(n = 500, random_state = 2)
        #print(sampled_data)
        data_frame.append(sampled_data)
    result = pd.concat(data_frame)
    print(result)
    result.to_csv("./../Data/merged_data.csv",na_rep='N/A')

if __name__ == "__main__":
    paths = ["./../Data/developer_survey_2020/survey_results_public_2020.csv","./../Data/developer_survey_2019/survey_results_public_2019.csv"]
    process(paths)