import unittest
import flask_testing
import json, os
from skill import app, db, Skill

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


    # app.config['TESTING'] = True

    # def test_view_skills(self):
    #     with app.test_client() as client:
    #         response = client.get('http://localhost:5001/view_skills')
    #         self.assertEqual(response.status_code, 200)
    #         data = response.json
    #         self.assertGreater(len(data), 0)
    
    # def test_view_single_skill(self):
    #     with app.test_client() as client:
    #         response = client.get('http://localhost:5001/view_skill/345678913')
    #         self.assertEqual(response.status_code, 200)
    #         data = response.json
    #         self.assertGreater(len(data), 0)

    # def test_create_skill(self):
    #     with app.test_client() as client:
    #         response = client.post('http://localhost:5001/create_skill', json={
    #             "skill_name": "Test Skill",
    #             "skill_status": "Active",
    #             "skill_description": "This is a test skill"
    #         })
    #         self.assertEqual(response.status_code, 200)
    #         data = response.json
    #         self.assertGreater(len(data), 0)

    # def test_update_skill(self):
    #     with app.test_client() as client:
    #         response = client.put('http://localhost:5001/update_skill/345678913', json={
    #             "skill_name": "Test Skill",
    #             "skill_status": "Active",
    #             "skill_description": "This is a test skill"
    #         })
    #         self.assertEqual(response.status_code, 200)
    #         data = response.json
    #         self.assertGreater(len(data), 0)

    # def test_get_all_staffs(self):
    #     with app.test_client() as client:
    #         response = client.get('http://localhost:5001/get_all_staffs')
    #         self.assertEqual(response.status_code, 200)
    #         data = response.json
    #         self.assertGreater(len(data), 0)
    
if __name__ == '__main__':
    unittest.main()
