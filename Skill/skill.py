from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

endpoint = os.environ.get("DB_ENDPOINT")
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)