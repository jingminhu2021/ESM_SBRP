import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import Enum
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

endpoint = os.environ.get("DB_HOST")
username = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+mysqlconnector://{username}:{password}@{endpoint}:3306/SBRP"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
CORS(app)

class ROLE_DETAILS(db.Model):
    __tablename__ = 'ROLE_DETAILS'

    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50))
    role_description = db.Column(db.String(50000))
    role_status = db.Column(db.Enum('active', 'inactive', name='role_status_enum'))
    
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

class ROLE_LISTINGS(db.Model):
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

    def json(self):
        item = {
            'role_listing_id': self.role_listing_id,
            'role_id': self.role_id,
            'role_listing_desc': self.role_listing_desc,
            'role_listing_source': self.role_listing_source,
            'role_listing_open': self.role_listing_open,
            'role_listing_close': self.role_listing_close,
            'role_listing_creator': self.role_listing_creator,
            'role_listing_ts_create': self.role_listing_ts_create,
            'role_listing_updater': self.role_listing_updater,
            'role_listing_ts_update': self.role_listing_ts_update,
            'role_listing_status': self.role_listing_status,
            
        }
        return item


# View all role listings
@app.route("/view_role_listings", methods=['GET'])
def view_role_listings():
    try:
        skills = request.args.getlist('skills')  # Get skills from query parameters
        # Perform the join
        results = db.session.query(ROLE_DETAILS, ROLE_LISTINGS, SKILL_DETAILS)\
                            .join(ROLE_LISTINGS, ROLE_DETAILS.role_id == ROLE_LISTINGS.role_id)\
                            .join(ROLE_SKILLS, ROLE_DETAILS.role_id == ROLE_SKILLS.role_id)\
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
        results = db.session.query(ROLE_DETAILS, ROLE_LISTINGS, SKILL_DETAILS)\
                            .join(ROLE_LISTINGS, ROLE_DETAILS.role_id == ROLE_LISTINGS.role_id)\
                            .join(ROLE_SKILLS, ROLE_DETAILS.role_id == ROLE_SKILLS.role_id)\
                            .join(SKILL_DETAILS, ROLE_SKILLS.skill_id == SKILL_DETAILS.skill_id)\
                            .filter(ROLE_LISTINGS.role_listing_id == role_listing_id)\
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
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100, debug=True)