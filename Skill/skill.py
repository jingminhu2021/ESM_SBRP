from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

endpoint = os.environ.get("DB_HOST")
username = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{username}:{password}@{endpoint}:3306/SBRP"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
CORS(app)

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

# @app.route("/get_skill_by_name/<skill_name>", methods=['GET'])
# def get_skill_by_name(skill_name):
#     try:
#         # Get skill by skill name
#         skill = Skill.query.filter_by(skill_name=skill_name).first()
#         # If skill does not exist
#         if skill is None:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": "Skill not found!"
#                 }
#             ), 404
#         # Return skill details
#         return jsonify(
#             {
#                 "code": 200,
#                 "data": skill.json(),
#                 "message": "Skill retrieved successfully!"
#             }
#         ), 200
#     except Exception as e:
#         return jsonify({'error': str(e)})

@app.route("/get_all_skills", methods=['GET'])
def get_all_skills():
    try:
        # Get all skills
        skills = Skill.query.all()
        # If no skills exist
        if not skills:
            return jsonify(
                {
                    "code": 404,
                    "message": "No skills found!"
                }
            ), 404
        # Return all skills
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skills": [skill.json() for skill in skills]
                },
                "message": "Skills retrieved successfully!"
            }
        ), 200
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/create_skill", methods=['POST'])
def create_skill():
    try:
        skill_name = request.json['skill_name']
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
        # # Check current user's role
        # if session['sys_role'] != "hr":
        #     return jsonify(
        #         {
        #             "code": 403,
        #             "message": "You are not authorized to access this page!"
        #         }
        #     ), 403
        
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
        skill.skill_name = data['skill_name']
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)