#!/usr/bin/env python3
import os
from flask import Flask, request, jsonify
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
    skill_description = db.Column(db.String(255), nullable=False)

    def json(self):
        item = {
            'skill_id': self.skill_id,
            'skill_name': self.skill_name,
            'skill_status': self.skill_status,
            'skill_description': self.skill_description,
        }
        return item
    

@app.route("/get_skills", methods=['POST'])
def get_skills():
    try:
        staff_id = request.form['account_id']
        print(staff_id)
        skills = Staff_Skills.query.all()
        if not skills:
            return jsonify({'message': 'No skills found','status': 'success', 'data': None})
        
        skills_list = []
        print(len(skills))
        for skill in skills:
            skill_details = Skill_Details.query.filter_by(skill_id=skill.skill_id).first()
            if skill_details.skill_status == 'active':
                skills_list.append(skill_details.json())
        
        response = jsonify({'message': 'Skills retrieved','status': 'success', 'data': skills_list})
        return response

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/get_all_skills", methods=['POST'])
def get_all_skills():
    try:
        staff_id = request.form['account_id']
        skills = Staff_Skills.query.all()
        staff_skill = []
        for skill in skills:
            skill_details = Skill_Details.query.filter_by(skill_id=skill.skill_id).first()
            staff_skill.append(skill_details.skill_id)
        all_skills_list = []
        all_skills =  Skill_Details.query.all()
        print(all_skills)
        for skill in all_skills:
            skill_details = Skill_Details.query.filter_by(skill_id=skill.skill_id).first()
            if skill_details.skill_status == 'active' and (skill_details.skill_id not in staff_skill):
                all_skills_list.append(skill.json())

        response = jsonify({'message': 'All skills retrieved','status': 'success', 'data': all_skills_list})
        return response

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True) #testing purpose