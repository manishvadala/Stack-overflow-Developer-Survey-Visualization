import pandas as pd
def func(df):
    new_df=df
    print(new_df)
    _filter="Gender"
    new_df = new_df[new_df[_filter].notna()]
    new_df = new_df.loc[new_df[_filter]=="Other"]
    print(new_df)

if __name__ == "__main__":
    path="../Data/merged_data_1.csv"
    df=pd.read_csv(path)
    func(df)