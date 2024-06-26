#!/usr/bin/env python3
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

DB_USERNAME = os.environ.get('DB_USERNAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
ENDPOINT = os.environ.get('DB_HOST')

app = Flask(__name__)

if __name__ == '__main__':
    app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{ENDPOINT}:3306/SBRP"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite://"

# Initialize the SQLAlchemy database object
db = SQLAlchemy(app)

# For Cross-Origin Resource Sharing
CORS(app, supports_credentials=True)

# Create a SQLAlchemy model for the staff_skills table
class Staff_Skills(db.Model):
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
    
class Skill_Details(db.Model):
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
    
class Staff_Details(db.Model):
    __tablename__ = 'STAFF_DETAILS'
    staff_id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    dept = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    biz_address = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    sys_role = db.Column(db.Enum("staff","hr","manager","inactive"), nullable=False)

    def json(self):
        item = {
            'staff_id': self.staff_id,
            'email': self.email,
            'fname': self.fname,
            'lname': self.lname,
            'phone': self.phone,
            'sys_role': self.sys_role,
            'dept': self.dept,
            'biz_address': self.biz_address,
        }
        return item
    

@app.route("/get_skills", methods=['POST'])
def get_skills():
    try:
        staff_id = request.form['staff_id']
        
        skills = Staff_Skills.query.filter_by(staff_id=staff_id).all()
        if not skills:
            return jsonify(
                {
                    'message': 'get_skills: No skills found',
                    'status': 'success', 
                    'data': None
                }
            )
        
        skills_list = []
        
        for skill in skills:
            
            skill_details = Skill_Details.query.filter_by(skill_id=skill.skill_id).first()
            
            full_skill = {}
            full_skill= skill.json()
            full_skill['skill_name']=skill_details.skill_name
            
            if skill_details.skill_status == 'active':
                skills_list.append(full_skill)
        
        return jsonify(
            {
                'message': 'get_skills: Skills retrieved',
                'status': 'success', 
                'data': skills_list
            }
        ), 200
        

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/get_all_skills", methods=['POST'])
def get_all_skills():
    try:
        
        all_skills =  Skill_Details.query.all()
        
        if not all_skills:
            return jsonify(
                {
                    'message': 'get_all_skills: No skills found',
                    'status': 'success', 
                    'data': None
                }
            )
        
        response = jsonify({
            'message': 'get_all_skills: All skills retrieved',
            'status': 'success', 
            'data': [skill.json() for skill in all_skills if skill.skill_status == 'active']
        })
        return response

    except Exception as e:
        return jsonify({'error': str(e)})


@app.route("/add_skills", methods=['POST'])
def add_skills():
    try:
        staff_id = request.form['staff_id']
        skill_name = request.form['skill_name']
        skill_status = request.form['skill_status']
        found_skill = Skill_Details.query.filter_by(skill_name=skill_name).filter_by(skill_status='active').first()
        print(found_skill)
        staff_skill = Staff_Skills(staff_id=staff_id, skill_id=found_skill.skill_id, ss_status=skill_status)
        db.session.add(staff_skill)
        db.session.commit()
        skill_details = Skill_Details.query.filter_by(skill_id=staff_skill.skill_id).first()
        full_skill = {}
        full_skill= staff_skill.json()
        full_skill['skill_name']=skill_details.skill_name
        return jsonify(
            {
                'message': 'add_skills: Skill added',
                'status': 'success', 
                'data': full_skill
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route("/update_skills", methods=['POST'])
def update_skills():
    try:
        staff_id = request.form['staff_id']
        skill_name = request.form['skill_name']
        skill_status = request.form['skill_status'] 

        #find skill id
        found_skill = Skill_Details.query.filter_by(skill_name=skill_name).filter_by(skill_status='active').first()

        #update skill status
        rows_changed =Staff_Skills.query.filter_by(staff_id=staff_id).filter_by(skill_id=found_skill.skill_id).update(dict(ss_status=skill_status))
        print(rows_changed)
        db.session.commit()
        
        return jsonify(
            {
                'message': 'update_skills: Skill updated',
                'status': 'success'
            }
        ), 200
    
    except Exception as e:
        return jsonify({'error': str(e)})
    
# get list of staff
@app.route("/get_staff_skill", methods=['GET'])
def get_staff_skill():
    try:
        # get all staff details from staff_details table
        staff_details = Staff_Details.query.filter(Staff_Details.sys_role != "inactive").all()

        if not staff_details:
            return jsonify(
                {
                    "code": 404,
                    'message': 'Staff details not found',
                    'status': 'error', 
                    'data': None
                }
            ), 404
        
        # Return success response
        return jsonify(
            {
                "code": 200,
                "data": [staff.json() for staff in staff_details]
            }
        ), 200
    
    except Exception as e:
        return jsonify({'error': str(e)})

# get staff profile
@app.route("/get_staff_profile/<int:staff_id>", methods=['GET'])
def get_staff_profile(staff_id):
    try:
        staff_details = Staff_Details.query.filter_by(staff_id=staff_id).first()
        if not staff_details:
            return jsonify(
                {
                    'message': 'Staff details not found',
                    'status': 'error', 
                    'data': None
                }
            ), 404
    
        skills = Staff_Skills.query.filter_by(staff_id=staff_id).all()
        if not skills:
            return jsonify(
                {
                    'message': 'Profile retrieved',
                    'status': 'success', 
                    'data': None,
                    'staff_details': {
                        'fname': staff_details.fname,
                        'lname': staff_details.lname,
                        'email': staff_details.email,
                        'phone': staff_details.phone,
                        'dept': staff_details.dept
                    }
                }
            ), 200
        

        # if skills found, get skill details
        skills_list = []
        
        for skill in skills:
            
            skill_details = Skill_Details.query.filter_by(skill_id=skill.skill_id).first()
            
            full_skill = {}
            full_skill= skill.json()
            full_skill['skill_name']=skill_details.skill_name
            
            if skill_details.skill_status == 'active':
                skills_list.append(full_skill)

        return jsonify(
            {
                'message': 'Profile retrieved',
                'status': 'success', 
                'data': skills_list,
                'staff_details': {
                    'fname': staff_details.fname,
                    'lname': staff_details.lname,
                    'email': staff_details.email,
                    'phone': staff_details.phone,
                    'dept': staff_details.dept
                }
            }
        ), 200

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True) #testing purpose