import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

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
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)