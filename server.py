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

@app.route('/barchart',methods=['POST'])
def barchart():
	_filters = request.data
	response = app.response_class(
		response=json.dumps({
			"random_array":np.random.rand(10)
		}, cls=NumpyArrayEncoder),
		status=200,
		mimetype='application/json'
	)
	return response

def load_data():
	years = ["2019","2020"]
	years_data=[]
	for year in years:
        _data_path = os.path.join(path,"developer_survey_"+year,"survey_results_public_"+year+".csv")
        df=pd.read_csv(_data_path)




if __name__ == "__main__":
	load_data()
	app.run(host=ALLOWED_HOST, port=PORT,debug=DEBUG)