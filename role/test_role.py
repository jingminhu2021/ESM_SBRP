import unittest
from main import app

class TestRoleAPI(unittest.TestCase):

    def setUp(self):
        self.validRoleListing = 64
        self.invalidRoleListing = 0
        self.validStaffId = 27
        self.invalidStaffId = 0
        self.validManagerId = 123456785
        self.validRoleId = 234567891
        self.invalidRoleId = 0

    def tearDown(self):
        self.validRoleListing = None
        self.invalidRoleListing = None

    def test_update_role_listing_status(self):
        with app.test_client() as client:

            #fail, not sure what this route post does
            self.assertEqual(client.post('http://localhost:5003/update_role_listing_status/').status_code, 200)

    def test_view_role_listing(self):
        with app.test_client() as client:
            self.assertEqual(client.get('http://localhost:5003/view_role_listings').status_code, 200)
    
    def test_view_role_single_listings(self):
        with app.test_client() as client:
            self.assertEqual(client.get(f'http://localhost:5003/view_role_single_listings/{self.validRoleListing}').status_code, 200)
            self.assertEqual(client.get(f'http://localhost:5003/view_role_single_listings/{self.invalidRoleListing}').status_code, 404)

    def test_get_staff_skills(self):
        with app.test_client() as client:
            self.assertEqual(client.get(f'http://localhost:5003/staff_skills/{self.validStaffId}').status_code, 200)

            #fail because staff id does not exist but returns an empty list
            self.assertEqual(client.get(f'http://localhost:5003/staff_skills/{self.invalidStaffId}').status_code, 404)

    def test_matching_and_missing_skills(self):
        with app.test_client() as client:
            self.assertEqual(client.get(f'http://localhost:5003/matching_and_missing_skills/{self.validRoleListing}/{self.validStaffId}').status_code, 200)

            #fail because returns empty list
            self.assertEqual(client.get(f'http://localhost:5003/matching_and_missing_skills/{self.invalidRoleListing}/{self.validStaffId}').status_code, 404)
            self.assertEqual(client.get(f'http://localhost:5003/matching_and_missing_skills/{self.validRoleListing}/{self.invalidStaffId}').status_code, 404)
            self.assertEqual(client.get(f'http://localhost:5003/matching_and_missing_skills/{self.invalidRoleListing}/{self.invalidStaffId}').status_code, 404)
            
    def test_view_skills(self):
        with app.test_client() as client:
            self.assertEqual(client.get('http://localhost:5003/view_skills').status_code, 200)
    
    def test_get_all_role_listings(self):
        with app.test_client() as client:
            self.assertEqual(client.get('http://localhost:5003/role_listing_id_option').status_code, 200)

    def test_get_role_listing_details(self):
        with app.test_client() as client:
            self.assertEqual(client.get(f'http://localhost:5003/role_listing_details/{self.validRoleListing}').status_code, 200)
            self.assertEqual(client.get(f'http://localhost:5003/role_listing_details/{self.invalidRoleListing}').status_code, 404)

    def test_get_role_id_options(self):
        with app.test_client() as client:
            self.assertEqual(client.get('http://localhost:5003/role_id_options').status_code, 200)

    def test_get_role_details(self):
        with app.test_client() as client:
            self.assertEqual(client.get(f'http://localhost:5003/role_details/{self.validRoleId}').status_code, 200)
            self.assertEqual(client.get(f'http://localhost:5003/role_details/{self.invalidRoleId}').status_code, 404)

    def test_get_manager_options(self):
        with app.test_client() as client:
            self.assertEqual(client.get(f'http://localhost:5003/manager_options').status_code, 200)

    def test_get_manager_details(self):
        with app.test_client() as client:
            self.assertEqual(client.get(f'http://localhost:5003/manager_details/{self.validManagerId}').status_code, 200)
            self.assertEqual(client.get(f'http://localhost:5003/manager_details/{self.invalidStaffId}').status_code, 404)
if __name__ == "__main__":
    unittest.main()

