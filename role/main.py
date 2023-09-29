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
class RoleListing(db.Model):
    __tablename__ = 'ROLE_LISTINGS'

    role_listing_id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('ROLE_DETAILS.role_id'), nullable=False)
    role_listing_desc = db.Column(db.String(255), nullable=True)
    role_listing_source = db.Column(db.Integer, db.ForeignKey('STAFF_DETAILS.staff_id'), nullable=True)
    role_listing_open = db.Column(db.String(10), nullable=False)  # Store as string 'DD-MM-YYYY'
    role_listing_close = db.Column(db.String(10))  # Store as string 'DD-MM-YYYY'
    role_listing_creator = db.Column(db.Integer, db.ForeignKey('STAFF_DETAILS.staff_id'), nullable=False)
    role_listing_ts_create = db.Column(db.DateTime, default=db.func.now())
    role_listing_updater = db.Column(db.Integer, db.ForeignKey('STAFF_DETAILS.staff_id'), nullable=False)
    role_listing_ts_update = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def __init__(self, role_id, role_listing_desc, role_listing_open, role_listing_close=None):
        self.role_id = role_id
        self.role_listing_desc = role_listing_desc
        self.role_listing_open = role_listing_open
        if role_listing_close is None:
            self.role_listing_close = role_listing_open + timedelta(weeks=2)
        else:
            self.role_listing_close = role_listing_close
    
    def json(self):
        item = {
            'role_listing_id': self.role_listing_id,
            'role_id': self.role_id,
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
    
class StaffDetails(db.Model):
    __tablename__ = 'STAFF_DETAILS'

    staff_id = db.Column(db.Integer, primary_key=True)
    
class RoleDetails(db.Model):
    __tablename__ = 'ROLE_DETAILS'

    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50))
    role_description = db.Column(db.String(50000))
    role_status = db.Column(db.Enum('active', 'inactive', name='role_status_enum'))

    def __init__(self, role_id, role_name, role_description, role_status):
        self.role_id = role_id
        self.role_name = role_name
        self.role_description = role_description
        self.role_status = role_status
    
    def json(self):
        item = {
            'role_id': self.role_id,
            'role_name': self.role_name,
            'role_description': self.role_description,
            'role_status': self.role_status,
        }
        return item
    
# View all role listings
@app.route("/role_listings", methods=['GET'])
def view_rolelistings():
    try:
        # Get all role listings in descending order (Latest created role listing first)
        rolelistings = RoleListing.query.order_by(RoleListing.role_listing_id.desc()).all()
        
        # If no role listing
        if len(rolelistings) == 0:
            return jsonify(
                {
                    "code": 404,
                    "message": "No role listings found!"
                }
            ), 404
        
        # Return success response
        return jsonify(
            {
                "code": 200,
                "data": [rolelisting.json() for rolelisting in rolelistings]
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# View a single role listing
@app.route("/view_rolelisting/<int:role_listing_id>", methods=['GET'])
def view_rolelisting(role_listing_id):
    try:
        # Get role listing to view
        rolelisting = RoleListing.query.filter_by(skill_id=role_listing_id).first()
        
        # If role listing does not exist
        if rolelisting is None:
            return jsonify(
                {
                    "code": 404,
                    "message": "Role Listing not found!"
                }
            ), 404
        
        # Return success response
        return jsonify(
            {
                "code": 200,
                "data": rolelisting.json()
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Display all available role IDs   
@app.route("/role_id_options", methods=["GET"])
def get_role_id_options():
    try:
        # Fetch all role_id values from the RoleDetails table
        role_ids = [str(role.role_id) for role in RoleDetails.query.all()]
        
        return jsonify(role_ids), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Display information for a specific role ID
@app.route("/role_details/<role_id>", methods=["GET"])
def get_role_details(role_id):
    try:
        # Fetch role details for the specified role_id
        role = RoleDetails.query.filter_by(role_id=role_id).first()

        if role:
            # Create a dictionary with the role details
            role_details = {
                "role_id": role.role_id,
                "role_name": role.role_name,
                "role_description": role.role_description,
                # Add other fields as needed
            }

            return jsonify(role_details), 200
        else:
            return jsonify({"error": "Role ID not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create a new role listing
@app.route("/create_rolelisting", methods=['POST'])
def create_rolelisting():
    try:
        role_id = request.json['role_id']
        role_listing_desc = request.json['role_listing_desc']
        # role_listing_source = request.json['role_listing_source']
        role_listing_open = datetime.strptime(request.json['role_listing_open'], '%d-%m-%Y').date()
        role_listing_close = datetime.strptime(request.json['role_listing_close'], '%d-%m-%Y').date()

        # Assuming you have a RoleListing model defined
        role_listing = RoleListing(
            role_id=role_id,
            role_listing_desc=role_listing_desc,
            # role_listing_source=role_listing_source,
            role_listing_open=role_listing_open,
            role_listing_close=role_listing_close,
        )
        db.session.add(role_listing)
        db.session.commit()
        return jsonify("Role listing created successfully."), 200
    except Exception as e:
        return jsonify("Error: " + str(e)), 400

@app.route("/update_rolelisting", methods=['PUT'])
def update_rolelisting():
    try:
        # Get role listing to update
        data = request.get_json()
        role_listing_id = data['role_listing_id']
        rolelisting = RoleListing.query.filter_by(role_listing_id=role_listing_id).first()
        
        # If skill does not exist
        if rolelisting is None:
            return jsonify(
                {
                    "code": 404,
                    "message": "Role listing not found!"
                }
            ), 404
        
        # Update role listing info
        rolelisting.role_listing_desc = data['role_listing_desc']
        rolelisting.role_listing_close = data['role_listing_close']
        
        # Commit changes to database
        db.session.commit()

        # Return success response
        return jsonify(
            {
                "code": 200,
                "data": rolelisting.json(),
                "message": "Role listing updated successfully!"
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route("/delete_rolelisting/<role_listing_id>", methods=['DELETE'])
def delete_rolelisting(role_listing_id):
    try:
        # Get role listing to delete
        rolelisting = RoleListing.query.get(role_listing_id)
        # If skill does not exist
        if rolelisting is None:
            return jsonify(
                {
                    "code": 404,
                    "message": "Role listing not found!"
                }
            ), 404
        # Delete the role listing
        db.session.delete(rolelisting)
        db.session.commit()
        
        # Return success response
        return jsonify({
            "code": 200,
            "message": "Role listing deleted successfully!"
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True) #testing purpose