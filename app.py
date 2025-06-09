import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import datetime

load_dotenv()

app = Flask(__name__)

@app.route('/')
def hello_html():
    now = datetime.datetime.now()
    return render_template('index.html', current_time=now)

if __name__ == '__main__':
    app.run(debug=True)
