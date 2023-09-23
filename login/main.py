#!/usr/bin/env python3
import os
from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

DB_USERNAME = os.environ.get('DB_USERNAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
ENDPOINT = os.environ.get('DB_HOST')

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{ENDPOINT}:3306/SBRP"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# Initialize the SQLAlchemy database object
db = SQLAlchemy(app)

# For Cross-Origin Resource Sharing
CORS(app)

@app.before_request
def make_session_permanent():
    session.permanent = True #By default, permanent session will last for 31 days


# Create a SQLAlchemy model for the accounts table
class Account(db.Model):
    __tablename__ = 'ACCOUNT'

    accounts_id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(140), nullable=False)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    phone=db.Column(db.String(20), nullable=False)
    sys_role = db.Column(db.Enum("staff","hr","manager","inactive"), nullable=False)
    dept = db.Column(db.String(50), nullable=False)
    biz_address = db.Column(db.String(255), nullable=True)
    profile_picture = db.Column(db.String(255), nullable=False)

    def json(self):
        item = {
            'accounts_id': self.accounts_id,
            'staff_id': self.staff_id,
            'email': self.email,
            'password': self.password,
            'fname': self.fname,
            'lname': self.lname,
            'phone': self.phone,
            'sys_role': self.sys_role,
            'dept': self.dept,
            'biz_address': self.biz_address,
            'profile_picture': self.profile_picture,
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

        # Create session data, we can access this data in other routes
        session['accounts_id'] = account.accounts_id
        session['staff_id'] = account.staff_id
        session['email'] = account.email
        session['fname'] = account.fname
        session['lname'] = account.lname
        session['phone'] = account.phone
        session['sys_role'] = account.sys_role
        session['dept'] = account.dept
        session['biz_address'] = account.biz_address
        session['profile_picture'] = account.profile_picture
        session['status'] = 'success'

        return jsonify({'message': 'Login successful!','status': 'success'})

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/logout", methods=['POST'])
def logout():
    session.clear()
    return redirect("/")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=True) #testing purpose