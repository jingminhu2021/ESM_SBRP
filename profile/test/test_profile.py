import unittest
import flask_testing
import json
from main import app, db, Staff_Skills, Skill_Details, Staff_Details

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

class TestProfileAPI(TestApp):

    def test_get_skills(self):
        ss1 = Staff_Skills(id = 1,
                        staff_id=123456789, 
                        skill_id=345678912, 
                        ss_status="active")  

        sd1 = Skill_Details(skill_id = 345678912,
                        skill_name="Test Skill", 
                        skill_status="active",
                        skill_description="Test Description")       
        
        db.session.add(ss1)
        db.session.add(sd1)
        db.session.commit()

        response = self.client.post('/get_skills', data={'staff_id': 123456789})
        self.assertEqual(response.status_code, 200)
        data = response.json    
        self.assertEqual(data['data'][0], {'skill_id': 345678912, 'skill_name': 'Test Skill', 'ss_status': 'active', 'staff_id': 123456789},msg="data = %s" % data)

    def test_get_skills_no_skills(self):
        response = self.client.post('/get_skills', data={'staff_id': 123456789})
        self.assertEqual(response.status_code, 200)
        data = response.json    
        self.assertEqual(data['data'], None,msg="data = %s" % data)
        self.assertEqual(data['message'], 'get_skills: No skills found',msg="data = %s" % data)

    def test_get_all_skills(self):
        s1 = Skill_Details(skill_id = 1,
                        skill_name="Test Skill", 
                        skill_status="active",
                        skill_description="Test Description")

        db.session.add(s1)
        db.session.commit()
        response = self.client.post("/get_all_skills")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0],{
                            'skill_id': 1,
                            'skill_name': "Test Skill",
                            'skill_status': 'active',
                            'skill_description': "Test Description"
                        },msg="data = %s" % data)
    
    def test_get_all_skills_no_skills(self):
        response = self.client.post("/get_all_skills")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'], None,msg="data = %s" % data)
        self.assertEqual(data['message'], 'get_all_skills: No skills found',msg="data = %s" % data)

    def test_add_skills(self):
        sd1 = Skill_Details(skill_id = 1,
                        skill_name="Test Skill", 
                        skill_status="active",
                        skill_description="Test Description")
        ss1 = Staff_Skills(id = 1,
                        staff_id=123456789, 
                        skill_id=345678912, 
                        ss_status="active")
        db.session.add(sd1)
        db.session.add(ss1)
        db.session.commit()
        response = self.client.post("/add_skills", data={'staff_id': 123456789, 'skill_name': 'Test Skill', 'skill_status': 'active'})
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'], {'skill_id': 1, 'skill_name': 'Test Skill', 'ss_status': 'active', 'staff_id': 123456789},msg="data = %s" % data)

    def test_add_skills_no_skill(self):
        response = self.client.post("/add_skills", data={'staff_id': 123456789, 'skill_name': 'Test Skill', 'skill_status': 'active'})
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertGreater(len(data['error']), 0,msg="data = %s" % data)

    def test_update_skills(self):
        sd1 = Skill_Details(skill_id = 1,
                        skill_name="Test Skill", 
                        skill_status="active",
                        skill_description="Test Description")
        ss1 = Staff_Skills(id = 1,
                        staff_id=123456789, 
                        skill_id=345678912, 
                        ss_status="active")
        db.session.add(sd1)
        db.session.add(ss1)
        db.session.commit()
        response = self.client.post("/update_skills", data={'staff_id': 123456789, 'skill_name': 'Test Skill', 'skill_status': 'inactive'})
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['message'], 'update_skills: Skill updated' ,msg="data = %s" % data)

    def test_update_skills_no_skill(self):
        response = self.client.post("/update_skills", data={'staff_id': 123456789, 'skill_name': 'Test Skill', 'skill_status': 'inactive'})
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertGreater(len(data['error']), 0,msg="data = %s" % data)

    def test_get_staff_skill(self):
        sd1 = Staff_Details(staff_id = 1,
                        email= 'test@gmail.com',
                        fname = 'test',
                        lname = 'test',
                        phone = '123456789',
                        sys_role = 'staff',
                        dept = 'test',
                        biz_address = 'test')
        
        db.session.add(sd1)
        db.session.commit()
        response = self.client.get("/get_staff_skill")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0],{
                            'staff_id': 1,
                            'email': 'test@gmail.com',
                            'fname': 'test',
                            'lname': 'test',
                            'phone': '123456789',
                            'sys_role': 'staff',
                            'dept': 'test',
                            'biz_address': 'test'
                        },msg="data = %s" % data)
        
    def test_get_staff_skill_no_staff(self):
        response = self.client.get("/get_staff_skill")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['data'], None,msg="data = %s" % data)
        self.assertEqual(data['message'], 'Staff details not found',msg="data = %s" % data)
    
    def test_get_staff_profile(self):
        sd1 = Staff_Details(staff_id = 1,
                        email= 'test@gmail.com',
                        fname = 'test',
                        lname = 'test',
                        phone = '123456789',
                        sys_role = 'staff',
                        dept = 'test',
                        biz_address = 'test')

        db.session.add(sd1)
        db.session.commit()
        response = self.client.get("/get_staff_profile/1")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['staff_details'],{
                            'fname': 'test',   
                            'lname': 'test',
                            'email': 'test@gmail.com',
                            'phone': '123456789',
                            'dept': 'test',
                        },msg="data = %s" % data)
        
    def test_get_staff_profile_no_staff(self):
        response = self.client.get("/get_staff_profile/1")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['data'], None,msg="data = %s" % data)
        self.assertEqual(data['message'], 'Staff details not found',msg="data = %s" % data)