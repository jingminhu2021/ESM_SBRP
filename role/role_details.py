#!/usr/bin/env python3
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta


DB_USERNAME = "sbrp_admin"
DB_PASSWORD = "30e?lLIy^,248fX9T"
ENDPOINT = "myrdsinstance.ctvrxbrt1hnb.ap-southeast-1.rds.amazonaws.com"

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{ENDPOINT}:3306/SBRP"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
CORS(app)

# Create a SQLAlchemy model for the role_listings table
class RoleDetails(db.Model):
    __tablename__ = 'ROLE_DETAILS'

    role_listing_id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('LJPS.ROLE_DETAILS.role_id'), nullable=False)
    role_name = db.Column(db.String(100), db.ForeignKey('LJPS.ROLE_DETAILS.role_name'), nullable=False)
    role_listing_desc = db.Column(db.String(255), nullable=True)
    role_listing_source = db.Column(db.Integer, db.ForeignKey('LMS.STAFF_DETAILS.staff_id'), nullable=False)
    role_listing_open = db.Column(db.DateTime, nullable=False)
    role_listing_close = db.Column(db.DateTime)  # You may set the default value as per your requirement
    role_listing_creator = db.Column(db.Integer, db.ForeignKey('LMS.STAFF_DETAILS.staff_id'), nullable=False)
    role_listing_ts_create = db.Column(db.DateTime, default=db.func.now())
    role_listing_updater = db.Column(db.Integer, db.ForeignKey('LMS.STAFF_DETAILS.staff_id'), nullable=False)
    role_listing_ts_update = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def __init__(self, role_listing_open, role_listing_close=None):
        self.role_listing_open = role_listing_open
        if role_listing_close is None:
            self.role_listing_close = role_listing_open + timedelta(weeks=2)
        else:
            self.role_listing_close = role_listing_close
    
    def json(self):
        item = {
            'role_listing_id': self.role_listing_id,
            'role_id': self.role_id,
            'role_name': self.role_name,
            'role_listing_desc': self.role_listing_desc,
            'role_listing_source': self.role_listing_source,
            'role_listing_open': self.role_listing_open.strftime('%d-%m-%Y'),  # Format as DD-MM-YYYY
            'role_listing_close': self.role_listing_close.strftime('%d-%m-%Y'),  # Format as DD-MM-YYYY
            'role_listing_creator': self.role_listing_creator,
            'role_listing_ts_create': self.role_listing_ts_create.strftime('%d-%m-%Y %H:%M:%S'),  # Format as DD-MM-YYYY HH:MM:SS
            'role_listing_updater': self.role_listing_updater,
            'role_listing_ts_update': self.role_listing_ts_update.strftime('%d-%m-%Y %H:%M:%S'),  # Format as DD-MM-YYYY HH:MM:SS
        }
        return item
    
#get all available role IDs   
@app.route("/role_id_options", methods=["GET"])
def get_role_id_options():
    try:
        # Fetch all role_id values from the RoleDetails table
        role_ids = [str(role.role_id) for role in RoleDetails.query.all()]
        
        return jsonify(role_ids), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=True) #testing purpose