#!/usr/bin/env python3
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum

DB_USERNAME = os.environ.get('DB_USERNAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
ENDPOINT = os.environ.get('DB_HOST')

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{ENDPOINT}:3306/SBRP"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# Initialize the SQLAlchemy database object
db = SQLAlchemy(app)

# For Cross-Origin Resource Sharing
CORS(app, supports_credentials=True)

# Create a SQLAlchemy model for the accounts table
class Account(db.Model):
    __tablename__ = 'ACCOUNT'

    accounts_id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(140), nullable=False)

    def json(self):
        item = {
            'accounts_id': self.accounts_id,
            'staff_id': self.staff_id,
            'email': self.email,
            'password': self.password,
        }
        return item
    
class StaffDetails(db.Model):
    __tablename__ = 'STAFF_DETAILS'

    staff_id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50))
    lname = db.Column(db.String(50))
    sys_role = db.Column(Enum('staff', 'hr', 'manager', 'inactive'))
=======
            'password': self.password
        }
        return item

@app.route("/login", methods=['POST'])
def login():
    try:
        email = request.form['email']
        password = request.form['password']
        account = Account.query.filter_by(email=email, password=password).first()

        if account is None:
            return jsonify({'message': 'No account found!', 'status': 'fail'})

        # Fetch staff details for the logged-in user
        staff_details = StaffDetails.query.filter_by(staff_id=account.staff_id).first()

        if staff_details is None:
            return jsonify({'message': 'Staff details not found!', 'status': 'fail'})

        # Include staff details in the response JSON
        response_data = {
            'message': 'Login successful!',
            'status': 'success',
            'data': {
                'accounts_id': account.accounts_id,
                'staff_id': account.staff_id,
                'email': account.email,
                'fname': staff_details.fname,
                'lname': staff_details.lname,
                'sys_role': staff_details.sys_role
            }
        }

        response = jsonify(response_data)
        return response

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True) #testing purpose