#1/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/test", methods=['GET'])
def main():
    print("invoking test microservice...")
    for i in range(5):
        print(i)
    print("end")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=True) #testing purpose