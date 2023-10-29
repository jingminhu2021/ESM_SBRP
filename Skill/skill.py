import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

endpoint = os.environ.get("DB_HOST")
username = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")

if __name__ == '__main__':
    app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{username}:{password}@{endpoint}:3306/SBRP"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite://"

db = SQLAlchemy(app)
# For Cross-Origin Resource Sharing
CORS(app, supports_credentials=True)

class Skill(db.Model):
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

# Create a SQLAlchemy model for the staff_skills table
class STAFF_SKILLS(db.Model):
    __tablename__ = 'STAFF_SKILLS'
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, nullable=False)
    skill_id = db.Column(db.Integer, nullable=False)
    ss_status = db.Column(db.Enum("active","unverified","in-progress"), nullable=False)

    def json(self):
        item = {
            'staff_id': self.staff_id,
            'skill_id': self.skill_id,
            'ss_status': self.ss_status,
        }
        return item
    
class STAFF_DETAILS(db.Model):
    __tablename__ = 'STAFF_DETAILS'
    staff_id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    dept = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    biz_address = db.Column(db.String(255), nullable=False)
    sys_role = db.Column(db.Enum("staff","hr","manager","inactive"), nullable=False)

    def json(self):
        item = {
            'staff_id': self.staff_id,
            'fname': self.fname,
            'lname': self.lname,
            'dept': self.dept,
            'email': self.email,
            'phone': self.phone,
            'biz_address': self.biz_address,
            'sys_role': self.sys_role,
        }
        return item

# View all skills
@app.route("/view_skills", methods=['GET'])
def view_skills():
    try:
        # Get all skills in descending order (Latest created skill first)
        skills = Skill.query.order_by(Skill.skill_id.desc()).all()
        
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

# View a single skill
@app.route("/view_skill/<int:skill_id>", methods=['GET'])
def view_skill(skill_id):
    try:
        # Get skill to view
        skill = Skill.query.filter_by(skill_id=skill_id).first()
        
        # If skill does not exist
        if skill is None:
            return jsonify(
                {
                    "code": 404,
                    "message": "Skill not found!"
                }
            ), 404
        
        # Return success response
        return jsonify(
            {
                "code": 200,
                "data": skill.json()
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/create_skill", methods=['POST'])
def create_skill():
    try:
        skill_name = request.json['skill_name'].strip()
        skill_status = request.json['skill_status']
        skill_description = request.json['skill_description']

        skill = Skill(skill_name=skill_name, skill_status=skill_status, skill_description=skill_description)
        db.session.add(skill)
        db.session.commit()
        return jsonify("Skill created successfully."), 200
    except Exception as e:
        return jsonify("Error: " + str(e)), 400

@app.route("/update_skill", methods=['PUT'])
def update_skill():
    try:
        # Get skill to update
        data = request.get_json()
        skill_id = data['skill_id']
        skill = Skill.query.filter_by(skill_id=skill_id).first()
        
        # If skill does not exist
        if skill is None:
            return jsonify(
                {
                    "code": 404,
                    "message": "Skill not found!"
                }
            ), 404
        
        # Update skill info
        skill.skill_name = data['skill_name'].strip()
        skill.skill_description = data['skill_description']
        
        # Commit changes to database
        db.session.commit()

        # Return success response
        return jsonify(
            {
                "code": 200,
                "data": skill.json(),
                "message": "Skill updated successfully!"
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route("/delete_skill/<skill_id>", methods=['PUT'])
def delete_skill(skill_id):
    try:
        # Get skill to update
        skill = Skill.query.filter_by(skill_id=skill_id).first()
        # If skill does not exist
        if skill is None:
            return jsonify(
                {
                    "code": 404,
                    "message": "Skill not found!"
                }
            ), 404
        # Update skill status
        skill_status = request.json['skill_status']
        skill.skill_status = skill_status
        # Commit changes to database
        db.session.commit()
        # Return success response
        return jsonify(
            {
                "code": 200,
                "data": skill.json(),
                "message": "Skill status updated successfully!"
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/get_skills_by_status/<skill_status>", methods=['GET'])
def get_skills_by_status(skill_status):
    try:
        # Get skills by status, in descending order (Latest created skill first)
        skills = Skill.query.filter_by(skill_status=skill_status).order_by(Skill.skill_id.desc()).all()
        # If no skills exist with the given status
        if not skills:
            return jsonify(
                {
                    "code": 404,
                    "message": "No skills found with the given status!"
                }
            ), 404
        # Return all skills with the given status
        return jsonify(
            {
                "code": 200,
                "data": [skill.json() for skill in skills],
                "message": "Skills retrieved successfully!"
            }
        ), 200
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/get_staffs_by_skill_id", methods=['POST'])
def get_staffs_by_skill_id():
    try:
        skill_id = request.json['skill_id']

        # Join STAFF_SKILLS and STAFF_DETAILS tables to get staffs with the specified skill_id
        staffs = (
            db.session.query(STAFF_SKILLS, STAFF_DETAILS)
            .join(STAFF_DETAILS, STAFF_SKILLS.staff_id == STAFF_DETAILS.staff_id)
            .filter(STAFF_SKILLS.skill_id == skill_id)
            .all()
        )
        if not staffs:
            return jsonify(
                {
                    'message': 'No staffs found with the specified skill_id',
                    'status': 'success',
                    'data': None
                }
            )
        # Extract relevant information and format the response
        staffs_data = [
            {
                'staff_id': staff.STAFF_DETAILS.staff_id,
                'fname': staff.STAFF_DETAILS.fname,
                'lname': staff.STAFF_DETAILS.lname,
                'dept': staff.STAFF_DETAILS.dept,
                'email': staff.STAFF_DETAILS.email,
                'phone': staff.STAFF_DETAILS.phone,
                'biz_address': staff.STAFF_DETAILS.biz_address,
                'sys_role': staff.STAFF_DETAILS.sys_role,
                'ss_status': staff.STAFF_SKILLS.ss_status,
            }
            for staff in staffs
        ]
        return jsonify(
            {
                'message': 'Staffs retrieved successfully!',
                'status': 'success',
                'data': staffs_data
            }
        )
    except Exception as e:
        return jsonify({'error': str(e)})
    

@app.route("/get_all_staffs", methods=['GET'])
def get_all_staffs():
    try:
        # Query all staffs from the STAFF_DETAILS table
        staffs = STAFF_DETAILS.query.filter(STAFF_DETAILS.sys_role != "inactive").all()
        # If no staffs exist
        if not staffs:
            return jsonify(
                {
                    'message': 'No staffs found!',
                    'status': 'success',
                    'data': None
                }
            )
        # Extract relevant information and format the response
        staffs_data = [
            {
                'staff_id': staff.staff_id,
                'fname': staff.fname,
                'lname': staff.lname,
                'dept': staff.dept,
                'email': staff.email,
                'phone': staff.phone,
                'biz_address': staff.biz_address,
                'sys_role': staff.sys_role,
            }
            for staff in staffs
        ]
        return jsonify(
            {
                'message': 'Staffs retrieved successfully!',
                'status': 'success',
                'data': staffs_data
            }
        )
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)