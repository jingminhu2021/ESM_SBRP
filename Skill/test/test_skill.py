import unittest
from skill import app

class TestSkillAPI(unittest.TestCase):

    app.config['TESTING'] = True

    def test_view_skills(self):
        with app.test_client() as client:
            response = client.get('http://localhost:5001/view_skills')
            self.assertEqual(response.status_code, 200)
            data = response.json
            self.assertGreater(len(data), 0)
    
    def test_view_single_skill(self):
        with app.test_client() as client:
            response = client.get('http://localhost:5001/view_skill/345678913')
            self.assertEqual(response.status_code, 200)
            data = response.json
            self.assertGreater(len(data), 0)

    def test_create_skill(self):
        with app.test_client() as client:
            response = client.post('http://localhost:5001/create_skill', json={
                "skill_name": "Test Skill",
                "skill_status": "Active",
                "skill_description": "This is a test skill"
            })
            self.assertEqual(response.status_code, 200)
            data = response.json
            self.assertGreater(len(data), 0)

    def test_update_skill(self):
        with app.test_client() as client:
            response = client.put('http://localhost:5001/update_skill/345678913', json={
                "skill_name": "Test Skill",
                "skill_status": "Active",
                "skill_description": "This is a test skill"
            })
            self.assertEqual(response.status_code, 200)
            data = response.json
            self.assertGreater(len(data), 0)

    def test_get_all_staffs(self):
        with app.test_client() as client:
            response = client.get('http://localhost:5001/get_all_staffs')
            self.assertEqual(response.status_code, 200)
            data = response.json
            self.assertGreater(len(data), 0)
    
if __name__ == '__main__':
    unittest.main()
