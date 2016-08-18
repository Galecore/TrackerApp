from pymongo import MongoClient

client = MongoClient()

collection = client['test']['tracker']

def get_all_users(user):
    return collection.find({"user": {'$ne':user}})

def insert_user_coords(user, lat, lng):
    collection.update_one({'user': user}, {'$set': {'lat':lat, 'lng':lng} }, True)

def nulify_user_coords(user):
    collection.update_one({'user': user}, {'$unset': {'lat':1, 'lng':1} })

from bson import json_util

import json


from flask import Flask
from flask import request
from flask import redirect, url_for


app = Flask(__name__)
app.debug = True

@app.route('/', methods=['POST'])
def index():
    if request.method == 'POST':
        #print(request.form)
        user = request.form['user']
        lat = request.form['lat']
        lng = request.form['lng'] 
        insert_user_coords(user, lat, lng)    
    return json.dumps(list(get_all_users(user)), default=json_util.default)

@app.route('/nulify', methods=['POST'])
def nulify():
    if request.method == 'POST':
        user = request.form['user']
        nulify_user_coords(user)
    return ''

if __name__ == '__main__':
    app.run(host='192.168.1.39', port=80)
