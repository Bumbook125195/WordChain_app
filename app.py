import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import datetime

load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play')
def play():
    return render_template('play.html')

@app.route('/rule')
def rule():
    return render_template('rule.html')

@app.route('/level')
def level():
    return render_template('level.html')

@app.route('/result')
def result():
    return render_template('result')

if __name__ == '__main__':
    app.run(debug=True)
