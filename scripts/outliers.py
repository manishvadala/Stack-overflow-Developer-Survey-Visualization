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

def salary_mismatch_fix(new_df):
    countries = ["United States"]
    salaries = [5000.0]
    new_df = new_df[new_df["CompFreq"].notna()]
    new_df = new_df[new_df["CompTotal"].notna()]
    for i in range(len(countries)):
        new_df["ConvertedComp"][(new_df["CompTotal"]>salaries[i]) & (new_df["CompFreq"]=="Weekly") & (new_df['Country']==countries[i])] = new_df["CompTotal"]
    index_names = new_df[(new_df["CompTotal"]>40000000) & (new_df['Country']==countries[i])].index
    new_df.drop(index_names, inplace = True)
    index_names = new_df[(new_df["ConvertedComp"]<100)].index
    #print(len(index_names))
    new_df.drop(index_names, inplace = True)
    return new_df

def education_Level(new_df):
    new_df = new_df[new_df['EdLevel'].notna()]
    #new_df["Edlevel"][(new_df["CompTotal"]>salaries[i]) & (new_df["CompFreq"]=="Weekly") & (new_df['Country']==countries[i])] = new_df["CompTotal"]
    new_df["EdLevel"].loc[new_df['EdLevel'].str.contains(r'Bachelor(?!$)')]="Bachelor's degree"
    new_df["EdLevel"].loc[new_df['EdLevel'].str.contains(r'Master(?!$)')]="Master's degree"
    new_df["EdLevel"].loc[new_df['EdLevel'].str.contains(r'doctoral(?!$)')]="Doctoral degree"
    new_df["EdLevel"].loc[new_df['EdLevel'].str.contains(r'never(?!$)')]="Other"
    new_df["EdLevel"].loc[new_df['EdLevel'].str.contains(r'Professional(?!$)')]="Other"
    new_df["EdLevel"].loc[new_df['EdLevel'].str.contains(r'Associate(?!$)')]="Associate degree"
    new_df["EdLevel"].loc[new_df['EdLevel'].str.contains(r'Secondary(?!$)')]="Secondary school"
    new_df["EdLevel"].loc[new_df['EdLevel'].str.contains(r'Some(?!$)')]="Secondary school"
    return new_df


if __name__ == "__main__":
    path="../Data/merged_data.csv"
    df=pd.read_csv(path)
    new_df=df
    new_df=year_filter(df)
    new_df=workweekhrs(new_df)
    new_df=salary_mismatch_fix(new_df)
    new_df=education_Level(new_df)
    new_df.to_csv("./../Data/merged_data_1.csv",na_rep='N/A')