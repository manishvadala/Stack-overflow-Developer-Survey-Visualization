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


@app.route('/barchart',methods=['POST'])
def barchart():
	_filters = request.data
	print(df)
	response = app.response_class(
		response=json.dumps({
			"random_array":np.random.rand(10)
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