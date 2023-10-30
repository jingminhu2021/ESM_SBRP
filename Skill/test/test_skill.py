import unittest
import flask_testing
import json, os
from skill import app, db, Skill, STAFF_DETAILS, STAFF_SKILLS
class TestApp(flask_testing.TestCase):
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite://"
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {}
    app.config['TESTING'] = True 
  
    def create_app(self):
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

class TestSkillAPI(TestApp):

    def test_view_skills(self):
        s1 = Skill(skill_id = 345678912,
                skill_name = "Test Skill",
                skill_status = "active",
                skill_description = "This is a test skill")
        db.session.add(s1)
        db.session.commit()

        response = self.client.get("/view_skills")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0], {'skill_description': 'This is a test skill', 'skill_id': 345678912, 'skill_name': 'Test Skill', 'skill_status': 'active'},msg="data = %s" % data)

    def test_view_skills_invalid(self):

        response = self.client.get("/view_skills")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['message'], 'No skills found!',msg="data = %s" % data)

    def test_view_single_skill(self):
        s1 = Skill(skill_id = 345678912,
                skill_name = "Test Skill",
                skill_status = "active",
                skill_description = "This is a test skill")
        db.session.add(s1)
        db.session.commit()
        response = self.client.get("/view_skill/345678912")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'],{'skill_description': 'This is a test skill', 'skill_id': 345678912, 'skill_name': 'Test Skill', 'skill_status': 'active'},msg="data = %s" % data)

    def test_view_single_skill_invalid(self):

        response = self.client.get("/view_skill/345678912")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['message'], 'Skill not found!',msg="data = %s" % data)

    def test_create_skill(self):
        response = self.client.post("/create_skill", data=json.dumps({
            "skill_name": "Test Skill",
            "skill_status": "active",
            "skill_description": "This is a test skill"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data, 'Skill created successfully.',msg="data = %s" % data)

        response = self.client.get("/view_skills")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0], {'skill_description': 'This is a test skill', 'skill_id': 1, 'skill_name': 'Test Skill', 'skill_status': 'active'},msg="data = %s" % data)

    def test_update_skill(self):
        s1 = Skill(skill_id = 345678912,
                skill_name = "Test Skill",
                skill_status = "active",
                skill_description = "This is a test skill")
        db.session.add(s1)
        db.session.commit()

        response = self.client.put("/update_skill", data=json.dumps({
            "skill_id": 345678912,
            "skill_name": "Test Skill 2",
            "skill_status": "active",
            "skill_description": "This is a test skill"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['message'], 'Skill updated successfully!',msg="data = %s" % data)
        self.assertEqual(data['data'], {'skill_description': 'This is a test skill', 'skill_id': 345678912, 'skill_name': 'Test Skill 2', 'skill_status': 'active'},msg="data = %s" % data)

    def test_update_invalid_skill(self):
        response = self.client.put("/update_skill", data=json.dumps({
            "skill_id": 345678912,
            "skill_name": "Test Skill 2",
            "skill_status": "active",
            "skill_description": "This is a test skill"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['message'], 'Skill not found!',msg="data = %s" % data)

    def test_delete_skill(self):
        s1 = Skill(skill_id = 345678912,
                skill_name = "Test Skill",
                skill_status = "active",
                skill_description = "This is a test skill")
        db.session.add(s1)
        db.session.commit()

        response = self.client.put("/delete_skill/345678912", data=json.dumps({
            "skill_status": "inactive"
        }),content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['message'], 'Skill status updated successfully!',msg="data = %s" % data)
        self.assertEqual(data['data'], {'skill_description': 'This is a test skill', 'skill_id': 345678912, 'skill_name': 'Test Skill', 'skill_status': 'inactive'},msg="data = %s" % data)

    def test_delete_invalid_skill(self):
        response = self.client.put("/delete_skill/345678912", data=json.dumps({
            "skill_status": "inactive"
        }),content_type='application/json')
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['message'], 'Skill not found!',msg="data = %s" % data)


    def test_get_skills_by_status(self):
        s1 = Skill(skill_id = 345678912,
                skill_name = "Test Skill",
                skill_status = "active",
                skill_description = "This is a test skill")
        db.session.add(s1)
        db.session.commit()

        response = self.client.get("/get_skills_by_status/active")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'], [{'skill_description': 'This is a test skill', 'skill_id': 345678912, 'skill_name': 'Test Skill', 'skill_status': 'active'}],msg="data = %s" % data)

    def test_get_skills_by_invalid_status(self):
        s1 = Skill(skill_id = 345678912,
                skill_name = "Test Skill",
                skill_status = "active",
                skill_description = "This is a test skill")
        db.session.add(s1)
        db.session.commit()

        response = self.client.get("/get_skills_by_status/invalid")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['message'], "No skills found with the given status!",msg="data = %s" % data)

    def test_get_staffs_by_skill_id(self):

        skill_1 = Skill(skill_id = 345678912,
                skill_name = "Test Skill",
                skill_status = "active",
                skill_description = "This is a test skill")
        
        staff_1 = STAFF_DETAILS(staff_id = 123456789,
                fname = "Test",
                lname = "Staff",
                dept = "Test Department",
                email = "test@email.com",
                phone = "1234567890",
                biz_address = "Test Address",
                sys_role = "staff")
        
        staff_skill_1 = STAFF_SKILLS(id=1,
            staff_id = 123456789,
            skill_id = 345678912,
            ss_status = "active"
        )
        db.session.add(skill_1)
        db.session.add(staff_1)
        db.session.add(staff_skill_1)
        db.session.commit()

        response = self.client.post("/get_staffs_by_skill_id", data=json.dumps({
            "skill_id": 345678912
            }),content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0], {'biz_address': 'Test Address', 'dept': 'Test Department', 'email': 'test@email.com', 'fname': 'Test', 'lname': 'Staff', 'phone': '1234567890', 'ss_status': 'active', 'staff_id': 123456789, 'sys_role': 'staff'},msg="data = %s" % data) 

    def test_get_staffs_by_invalid_skill_id(self):

        skill_1 = Skill(skill_id = 345678912,
                skill_name = "Test Skill",
                skill_status = "active",
                skill_description = "This is a test skill")
        
        staff_1 = STAFF_DETAILS(staff_id = 123456789,
                fname = "Test",
                lname = "Staff",
                dept = "Test Department",
                email = "test@email.com",
                phone = "1234567890",
                biz_address = "Test Address",
                sys_role = "staff")
        
        staff_skill_1 = STAFF_SKILLS(id=1,
            staff_id = 123456789,
            skill_id = 345678912,
            ss_status = "active"
        )
        db.session.add(skill_1)
        db.session.add(staff_1)
        db.session.add(staff_skill_1)
        db.session.commit()

        response = self.client.post("/get_staffs_by_skill_id", data=json.dumps({
            "skill_id": 1
            }),content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['message'], 'No staffs found with the specified skill_id',msg="data = %s" % data)

    def test_get_all_staffs(self):

        staff_1 = STAFF_DETAILS(staff_id = 123456789,
                fname = "Test",
                lname = "Staff",
                dept = "Test Department",
                email = "test@email.com",
                phone = "1234567890",
                biz_address = "Test Address",
                sys_role = "staff")
        
        staff_2 = STAFF_DETAILS(staff_id = 987654321,
                fname = "Test2",
                lname = "Staff2",
                dept = "Test Departmen2",
                email = "tes2t@email.com",
                phone = "0987654321",
                biz_address = "Test Address2",
                sys_role = "inactive")
        
        db.session.add(staff_1)
        db.session.add(staff_2)
        db.session.commit()

        response = self.client.get("/get_all_staffs")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'], [{'biz_address': 'Test Address', 'dept': 'Test Department', 'email': 'test@email.com', 'fname': 'Test', 'lname': 'Staff', 'phone': '1234567890', 'staff_id': 123456789, 'sys_role': 'staff'}],msg="data = %s" % data)

    def test_get_all_staffs_invalid(self):

        staff_2 = STAFF_DETAILS(staff_id = 987654321,
                fname = "Test2",
                lname = "Staff2",
                dept = "Test Departmen2",
                email = "tes2t@email.com",
                phone = "0987654321",
                biz_address = "Test Address2",
                sys_role = "inactive")
         
        db.session.add(staff_2)
        db.session.commit()

        response = self.client.get("/get_all_staffs")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['message'], 'No staffs found!',msg="data = %s" % data)
    
if __name__ == '__main__':
    unittest.main()
