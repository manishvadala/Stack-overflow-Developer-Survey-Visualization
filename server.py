import numpy as np
import pandas as pd
import json
from json import JSONEncoder
from flask import Flask,request
from config import *

app = Flask(__name__)

class NumpyArrayEncoder(JSONEncoder):
	def default(self, obj):
		if isinstance(obj, np.ndarray):
			return obj.tolist()
		return JSONEncoder.default(self, obj)

def extract_technologies(df,key,rows):
	df = df[df[key].notna()]
	langs = df[key].astype(str)
	all_langs=[]
	mp={}
	for lang in langs:
		l_lang=lang.split(";")
		for x in l_lang:
			if x not in mp:
				mp[x]=0
			else:
				mp[x]+=1
	mp=dict(sorted(mp.items(), key=lambda item: item[1]))
	for _key in mp:
		mp[_key]=(mp[_key]/rows)*100
	return mp

def prep_resp_data(tech_data,years):
	latest_data = tech_data[-1]
	arr=[(i,latest_data[i]) for i in latest_data]
	arr=arr[::-1]
	resp_data=[]
	for ele in arr:
		mp={"group":ele[0]}
		for i in range(0,len(tech_data)):
			if ele[0] in tech_data[i]:
				mp[years[i]]=tech_data[i][ele[0]]
		resp_data.append(mp)
	return resp_data


@app.route('/barchart',methods=['POST'])
def barchart():
	req_data = request.json
	_filters = req_data["_filters"]
	_key = req_data["_display"]
	years=[2019,2020]
	tech_data=[]
	for year in years:
		new_df = df.loc[df['year'] == year]
		rows = new_df.shape[0]
		for _filter in _filters:
			new_df = new_df[new_df[_filter].notna()]
			new_df = new_df.loc[new_df[_filter] == _filters[_filter]]
		td=extract_technologies(new_df,_key,rows)
		tech_data.append(td)
	resp_data = prep_resp_data(tech_data,years)
	response = app.response_class(
		response=json.dumps({
			"bc_data":resp_data
		}, cls=NumpyArrayEncoder),
		status=200,
		mimetype='application/json'
	)
	return response

def load_data():
	_data_path = os.path.join(BASE_PATH,"Data","merged_data.csv")
	global df
	df=pd.read_csv(_data_path)

if __name__ == "__main__":
	load_data()
	app.run(host=ALLOWED_HOST, port=PORT,debug=DEBUG)