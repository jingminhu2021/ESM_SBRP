#!/usr/bin/env python3
import os
import sys
from datetime import datetime, timedelta
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum


ENDPOINT = os.environ.get("DB_HOST")
DB_USERNAME = os.environ.get("DB_USERNAME")
DB_PASSWORD = os.environ.get("DB_PASSWORD")

app = Flask(__name__)

# Set up CORS
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{ENDPOINT}:3306/SBRP"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
CORS(app)

# Create a SQLAlchemy model for the role_listings table
class RoleListing(db.Model):
    __tablename__ = 'ROLE_LISTINGS'

    role_listing_id = db.Column(db.Integer, primary_key=True, unique=True)
    role_id = db.Column(db.Integer, db.ForeignKey('ROLE_DETAILS.role_id'), nullable=False)
    role_listing_desc = db.Column(db.String(255), nullable=True)
    role_listing_source = db.Column(db.Integer, db.ForeignKey('STAFF_DETAILS.staff_id'))
    role_listing_open = db.Column(db.String(20), nullable=False)  # Store as string 'DD-MM-YYYY'
    role_listing_close = db.Column(db.String(20))  # Store as string 'DD-MM-YYYY'
    role_listing_creator = db.Column(db.Integer, db.ForeignKey('STAFF_DETAILS.staff_id'), nullable=False)
    role_listing_ts_create = db.Column(db.DateTime, default=db.func.now())
    role_listing_updater = db.Column(db.Integer, db.ForeignKey('STAFF_DETAILS.staff_id'), nullable=False)
    role_listing_ts_update = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    role_listing_status = db.Column(Enum('active', 'inactive'), default='active', nullable=False)

    def __init__(self, role_id, role_listing_creator, role_listing_updater, role_listing_open, role_listing_close=None, role_listing_desc=None, role_listing_source=None):
        self.role_listing_id = self.generate_unique_random_id()  # Generate a unique random ID
        self.role_id = role_id
        self.role_listing_open = role_listing_open
        self.role_listing_close = role_listing_close
        self.role_listing_desc = role_listing_desc
        self.role_listing_source = role_listing_source
        self.role_listing_creator = role_listing_creator
        self.role_listing_updater = role_listing_updater

    def generate_unique_random_id(self):
        while True:
            random_id = random.randint(1, 1000000)
            existing_ids = [row[0] for row in db.session.query(RoleListing.role_listing_id).all()]  # Fetch existing IDs
            if random_id not in existing_ids:
                return random_id
            
    def json(self):
        item = {
            'role_listing_id': self.role_listing_id,
            'role_id': self.role_id,
            'role_listing_desc': self.role_listing_desc,
            'role_listing_source': self.role_listing_source,
            'role_listing_open': self.role_listing_open.strftime('%Y-%m-%d'),  # Format as DD-MM-YYYY
            'role_listing_close': self.role_listing_close.strftime('%Y-%m-%d'),  # Format as DD-MM-YYYY
            'role_listing_creator': self.role_listing_creator,
            'role_listing_ts_create': self.role_listing_ts_create.strftime('%Y-%m-%d %H:%M:%S'),  # Format as DD-MM-YYYY HH:MM:SS
            'role_listing_updater': self.role_listing_updater,
            'role_listing_ts_update': self.role_listing_ts_update.strftime('%Y-%m-%d %H:%M:%S'),  # Format as DD-MM-YYYY HH:MM:SS
        }
        return item
    
class StaffDetails(db.Model):
    __tablename__ = 'STAFF_DETAILS'

    staff_id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50))
    lname = db.Column(db.String(50))
    sys_role = db.Column(Enum('staff', 'hr', 'manager', 'inactive'))
    
class RoleDetails(db.Model):
    __tablename__ = 'ROLE_DETAILS'

    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50))
    role_description = db.Column(db.String(50000))
    role_status = db.Column(db.Enum('active', 'inactive'))

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
    
class SKILL_DETAILS(db.Model):
    __tablename__ = 'SKILL_DETAILS'

    skill_id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(50), nullable=False)
    skill_status = db.Column(db.Enum("active","inactive"), nullable=False)
    skill_description = db.Column(db.String(255), nullable=True)

    def json(self):
        item = {
            'skill_id': self.skill_id,
            'skill_name': self.skill_name,
            'skill_status': self.skill_status,
            'skill_description': self.skill_description,
        }
        return item

class ROLE_SKILLS(db.Model):
    __tablename__ = 'ROLE_SKILLS'

    role_id = db.Column(db.Integer, db.ForeignKey('ROLE_DETAILS.role_id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('SKILL_DETAILS.skill_id'), primary_key=True)
    
    def json(self):
        item = {
            'role_id': self.role_id,
            'skill_id': self.skill_id,
        }
        return item
    
# View all role listings
@app.route("/view_role_listings", methods=['GET'])
def view_role_listings():
    try:
        #skills = request.args.getlist('skills')  # Get skills from query parameters
        # Perform the join
        results = db.session.query(RoleDetails, RoleListing, SKILL_DETAILS)\
                            .join(RoleListing, RoleDetails.role_id == RoleListing.role_id)\
                            .join(ROLE_SKILLS, RoleDetails.role_id == ROLE_SKILLS.role_id)\
                            .join(SKILL_DETAILS, ROLE_SKILLS.skill_id == SKILL_DETAILS.skill_id)\
                            .all()
        
        # Dictionary to hold combined data with role_id as key
        roles_dict = {}
        
        for role_detail, role_listing, skill_detail in results:
            role_id = role_detail.role_id
            if role_id not in roles_dict:
                roles_dict[role_id] = {
                    "role_name": role_detail.role_name,
                    "role_id": role_id,
                    "skills_list": [],
                    "role_listing_id": role_listing.role_listing_id,
                    "role_listing_desc": role_listing.role_listing_desc,
                    "role_listing_status": role_listing.role_listing_status,
                    "role_listing_open": role_listing.role_listing_open,
                    "role_listing_close": role_listing.role_listing_close
                }
            roles_dict[role_id]["skills_list"].append(skill_detail.skill_name)
        
        # Convert the roles dictionary into a list for output
        combined_data = list(roles_dict.values())
        
        # Return the combined data
        return jsonify({"code": 200, "data": combined_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#View a single rolelistings
@app.route("/view_role_single_listings/<int:role_listing_id>", methods=['GET'])
def view_role_single_listing(role_listing_id):
    try:
        # Query to fetch the role listing and associated skills based on role_listing_id
        results = db.session.query(RoleDetails, RoleListing, SKILL_DETAILS)\
                            .join(RoleListing, RoleDetails.role_id == RoleListing.role_id)\
                            .join(ROLE_SKILLS, RoleDetails.role_id == ROLE_SKILLS.role_id)\
                            .join(SKILL_DETAILS, ROLE_SKILLS.skill_id == SKILL_DETAILS.skill_id)\
                            .filter(RoleListing.role_listing_id == role_listing_id)\
                            .all()
        
        # Dictionary to hold combined data with role_id as key
        role_data = {}
        
        for role_detail, role_listing, skill_detail in results:
            role_id = role_detail.role_id
            if role_id not in role_data:
                role_data[role_id] = {
                    "role_name": role_detail.role_name,
                    "role_id": role_id,
                    "skills_list": [],
                    "role_listing_id": role_listing.role_listing_id,
                    "role_listing_desc": role_listing.role_listing_desc,
                    "role_listing_status": role_listing.role_listing_status,
                    "role_listing_open": role_listing.role_listing_open,
                    "role_listing_close": role_listing.role_listing_close
                }
            role_data[role_id]["skills_list"].append(skill_detail.skill_name)
        
        # Convert the role dictionary into the desired output format
        combined_data = role_data.get(role_id, {})
        
        # Return the combined data
        return jsonify({"code": 200, "data": combined_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/view_skills", methods=['GET'])
def view_skills():
    try:
        # Get all skills in descending order (Latest created skill first)
        skills = SKILL_DETAILS.query.order_by(SKILL_DETAILS.skill_id.desc()).all()
        
        # If no skill
        if len(skills) == 0:
            return jsonify(
                {
                    "code": 404,
                    "message": "No skills found!"
                }
            ), 404
        
        # Return success response
        return jsonify(
            {
                "code": 200,
                "data": [skill.json() for skill in skills]
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Display all active role listing IDs
@app.route("/role_listing_id_option", methods=["GET"])
def get_all_role_listings():
    try:
        # Fetch all active role_listing_id values from the RoleListing table
        active_role_listing_ids = [str(role.role_listing_id) for role in RoleListing.query.filter_by(role_listing_status='active').all()]
        
        return jsonify(active_role_listing_ids), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
# Display information for a specific role listing ID
@app.route("/role_listing_details/<role_listing_id>", methods=["GET"])
def get_role_listing_details(role_listing_id):
    try:
        # Fetch role listing details for the specified role_listing_id
        role_listing = RoleListing.query.filter_by(role_listing_id=role_listing_id).first()

        if role_listing:
            # Create a dictionary with the role listing details
            role_listing_details = {
                "role_listing_id": role_listing.role_listing_id,
                "role_id": role_listing.role_id,
                "role_listing_desc": role_listing.role_listing_desc,
                "role_listing_open": role_listing.role_listing_open,
                "role_listing_close": role_listing.role_listing_close,
                "role_listing_source":role_listing.role_listing_source,
                "role_listing_status":role_listing.role_listing_status
                # Add other fields as needed
            }

            return jsonify(role_listing_details), 200
        
        return jsonify({"error": "Role Listing ID not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
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
        
        return jsonify({"error": "Role ID not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Get all managers under sys_role
@app.route("/manager_options", methods=["GET"])
def get_manager_options():
    try:
        # Fetch all managers under a specific sys_role (adjust as needed)
        sys_role = 'manager'
        managers = StaffDetails.query.filter_by(sys_role=sys_role).all()

        # Create a list of dictionaries with staff_id, fname, and lname
        manager_info = [
            {
                "staff_id": manager.staff_id,
                "fname": manager.fname,
                "lname": manager.lname
            }
            for manager in managers
        ]

        return jsonify(manager_info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/manager_details/<staff_id>', methods=['GET'])
def get_manager_details(staff_id):
    try:
        # Query the ManagerDetails table for the specified staff_id
        manager = StaffDetails.query.filter_by(staff_id=staff_id).first()

        if manager:
            # Create a dictionary to store manager details
            manager_data = {
                'staff_id': manager.staff_id,
                'fname': manager.fname,
                'lname': manager.lname,
                # Add other manager-related fields here
            }
            return jsonify(manager_data), 200
        
        return jsonify({'error': 'Manager not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/skill_options', methods=['GET'])
def get_skill_options():
    # Query your database to retrieve a list of skill options
    # This example assumes you have a Skill model
    skill_options = SKILL_DETAILS.query.all()

    # Format the skill options as needed
    formatted_options = [{'skill_id': skill.skill_id, 'skill_name': skill.skill_name} for skill in skill_options]

    return jsonify(formatted_options)

@app.route('/associate_skills', methods=['POST'])
def associate_skills():
    try:
        data = request.get_json()  # Assuming data is sent as JSON in the request body

        # Extract data from the request
        role_id = data.get('role_id')
        selected_skills = data.get('skills')

        # Validate data if needed
        if not role_id or not selected_skills:
            return jsonify({'error': 'Invalid data'}), 400

        # Create associations between the role and selected skills
        for skill_id in selected_skills:
            # This example assumes you have a RoleSkills model to represent the many-to-many relationship
            role_skill = ROLE_SKILLS(role_id=role_id, skill_id=skill_id)
            db.session.add(role_skill)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({'message': 'Skills associated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Create a new role listing
@app.route("/create_rolelisting", methods=['POST'])
def create_rolelisting():
    try:
        role_id = request.json['role_id']
        role_listing_desc = request.json['role_listing_desc']
        role_listing_source = request.json['role_listing_source']
        role_listing_open_str = request.json['role_listing_open']  # Get the date as a string

        # Convert role_listing_open_str to a datetime object
        role_listing_open = datetime.strptime(role_listing_open_str, '%d-%m-%Y')

        # Check if 'role_listing_close' is provided in the JSON request
        if 'role_listing_close' in request.json and request.json['role_listing_close']:
            # Use the provided 'role_listing_close' value if it exists
            role_listing_close_str = request.json['role_listing_close']
            role_listing_close = datetime.strptime(role_listing_close_str, '%d-%m-%Y')
        else:
            # Calculate role_listing_close as 2 weeks (14 days) from role_listing_open
            role_listing_close = role_listing_open + timedelta(weeks=2)

        # Check if 'role_listing_source' is provided in the JSON request
        if 'role_listing_source' in request.json:
            role_listing_source = request.json['role_listing_source']
        else:
            role_listing_source = None  # Set to None if not provided

        # Get the staff ID of the currently logged-in user
        role_listing_creator = request.json['role_listing_creator']
        role_listing_updater = request.json['role_listing_updater']

        # Assuming you have a RoleListing model defined
        role_listing = RoleListing(
            role_id=role_id,
            role_listing_desc=role_listing_desc,
            role_listing_source=role_listing_source,
            role_listing_open=role_listing_open.strftime('%Y-%m-%d %H:%M:%S'),  # Format as 'YYYY-MM-DD HH:MM:SS'
            role_listing_close=role_listing_close.strftime('%Y-%m-%d %H:%M:%S'),  # Format as 'YYYY-MM-DD HH:MM:SS'
            role_listing_creator=role_listing_creator,
            role_listing_updater=role_listing_updater,
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
                    "message": "Role listing not updated!"
                }
            ), 404
        
        # Update role listing info
        rolelisting.role_listing_desc = data['role_listing_desc']
        rolelisting.role_listing_open = data['role_listing_open']
        rolelisting.role_listing_close = data['role_listing_close']
        rolelisting.role_listing_updater = data['role_listing_updater']
        rolelisting.role_listing_source = data['role_listing_source']
        
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
        # If role listing does not exist
        if rolelisting is None:
            return jsonify(
                {
                    "code": 404,
                    "message": "Role listing not found!"
                }
            ), 404
        # Update the status to "inactive" and commit the change
        rolelisting.role_listing_status = 'inactive'
        db.session.commit()
        
        # Return success response
        return jsonify({
            "code": 200,
            "message": "Role listing deleted successfully!"
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=True) #testing purpose