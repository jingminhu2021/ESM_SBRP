import unittest
import flask_testing
import json, os
from datetime import datetime
from main import app, db, RoleListing, StaffDetails, RoleDetails, SKILL_DETAILS, ROLE_SKILLS, StaffSkills, ROLE_APPLICATIONS


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

class TestRoleListing(TestApp):

    def test_view_role_listing(self):
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator="123456788",
            role_listing_updater="123456788")
        
        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )

        rs1 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678918
        )

        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )
    
        db.session.add(rl1)
        db.session.add(rd1)
        db.session.add(rs1)
        db.session.add(sd1)
        db.session.commit()

        response = self.client.get("/view_role_listings_hr")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0]['role_id'], 234567891, msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['role_listing_close'], '30/12/2023', msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['role_listing_desc'], 'The Head, Talent Attraction', msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['role_listing_open'], '13/10/2023', msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['role_listing_status'], 'active', msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['skills_list'][0], 'Recruitment', msg= "data = %s" % data)

    def test_view_role_listing_empty(self):
        response = self.client.get("/view_role_listings_hr")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data['data']), 0, msg= "data = %s" % data)

    def test_view_role_listings_manager(self):
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator="123456788",
            role_listing_updater="123456788")
        
        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )

        rs1 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678918
        )

        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )
    
        db.session.add(rl1)
        db.session.add(rd1)
        db.session.add(rs1)
        db.session.add(sd1)
        db.session.commit()

        response = self.client.get("/view_role_listings_manager/123456787")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0]['role_id'], 234567891, msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['role_listing_close'], '30/12/2023', msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['role_listing_desc'], 'The Head, Talent Attraction', msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['role_listing_open'], '13/10/2023', msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['role_listing_status'], 'active', msg= "data = %s" % data)
        self.assertEqual(data['data'][0]['skills_list'][0], 'Recruitment', msg= "data = %s" % data)

    def test_view_role_listings_invalid_manager(self):
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator="123456788",
            role_listing_updater="123456788")
        
        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )

        rs1 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678918
        )

        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )
    
        db.session.add(rl1)
        db.session.add(rd1)
        db.session.add(rs1)
        db.session.add(sd1)
        db.session.commit()

        response = self.client.get("/view_role_listings_manager/123456789")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data['data']), 0, msg= "data = %s" % data)


    def test_view_role_listings_empty_manager(self):

        response = self.client.get("/view_role_listings_manager/123456789")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data['data']), 0, msg= "data = %s" % data)

    def test_view_role_listings_no_manager(self):
        response = self.client.get("/view_role_listings_manager/")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data, None, msg= "data = %s" % data)

    def test_view_role_single_listings(self):
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator="123456788",
            role_listing_updater="123456788")
        
        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )

        rs1 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678918
        )

        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )
    
        db.session.add(rl1)
        db.session.add(rd1)
        db.session.add(rs1)
        db.session.add(sd1)
        db.session.commit()

        response = self.client.get("/view_role_listings_hr")
        self.assertEqual(response.status_code, 200)
        data = response.json
        url = "/view_role_single_listings/" + str(data['data'][0]['role_listing_id'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data']['role_id'], 234567891, msg= "data = %s" % data)

    def test_view_role_invalid_single_listings(self):
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator="123456788",
            role_listing_updater="123456788")
        
        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )

        rs1 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678918
        )

        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )
    
        db.session.add(rl1)
        db.session.add(rd1)
        db.session.add(rs1)
        db.session.add(sd1)
        db.session.commit()


        url = "/view_role_single_listings/0"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['message'], 'Role listing not found.', msg= "data = %s" % data)

    def test_staff_skills(self):
        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )

        sd2 = SKILL_DETAILS(
            skill_id=345678919,
            skill_name="Python",
            skill_description="Programming langauge",
            skill_status="active"
        )

        ss1 = StaffSkills(
            id = 33,
            staff_id=123456789,
            skill_id=345678918,
            ss_status = "unverified"
        )

        ss2 = StaffSkills(
            id = 34,
            staff_id=123456789,
            skill_id=345678919,
            ss_status = "unverified"
        )
        
        db.session.add(sd1)
        db.session.add(ss1)
        db.session.add(sd2)
        db.session.add(ss2)
        db.session.commit()

        response = self.client.get("/staff_skills/123456789")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['staff_skills'], ['Recruitment','Python'], msg= "data = %s" % data)

    def test_staff_no_skills(self):

        response = self.client.get("/staff_skills/123456789")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['staff_skills'], [], msg= "data = %s" % data)    

    def test_role_skills(self):
        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )

        sd2 = SKILL_DETAILS(
            skill_id=345678919,
            skill_name="Python",
            skill_description="Programming langauge",
            skill_status="active"
        )

        rs1 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678918
        )

        rs2 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678919
        )
        
        db.session.add(sd1)
        db.session.add(rs1)
        db.session.add(sd2)
        db.session.add(rs2)
        db.session.commit()

        response = self.client.get("/role_skills/234567891")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['role_skills'], ['Recruitment','Python'], msg= "data = %s" % data)

    def test_no_role_skills(self):
            
        response = self.client.get("/role_skills/234567891")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['role_skills'], [], msg= "data = %s" % data)

    def test_matching_and_missing_skills(self):
        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )

        rs1 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678918
        )

        sd2 = SKILL_DETAILS(
            skill_id=345678919,
            skill_name="Python",
            skill_description="Programming langauge",
            skill_status="active"
        )

        rs2 = ROLE_SKILLS(
            role_id=234567891,
            skill_id=345678919
        )

        ss1 = StaffSkills(
            id = 33,
            staff_id=123456789,
            skill_id=345678918,
            ss_status = "verified"
        )

        db.session.add(sd1)
        db.session.add(rs1)
        db.session.add(ss1)
        db.session.add(sd2)
        db.session.add(rs2)
        db.session.commit()

        response = self.client.get("/matching_and_missing_skills/234567891/123456789")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['matching_skills'], ['Recruitment'], msg= "data = %s" % data)
        self.assertEqual(data['missing_skills'], ['Python'], msg= "data = %s" % data)

    def test_no_matching_and_missing_skills(self):

        response = self.client.get("/matching_and_missing_skills/234567891/123456789")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['matching_skills'], [], msg= "data = %s" % data)
        self.assertEqual(data['missing_skills'], [], msg= "data = %s" % data)

    def test_get_all_role_listings(self):
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator="123456788",
            role_listing_updater="123456788")
        
        db.session.add(rl1)
        db.session.commit()

        response = self.client.get("/role_listing_id_option")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data), 1, msg= "data = %s" % data)


    def test_get_all_role_listings_empty(self):
            
        response = self.client.get("/role_listing_id_option")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data), 0, msg= "data = %s" % data)

    def test_get_role_listing_with_details(self):
         
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00", 
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator="123456788",
            role_listing_updater="123456788")
        
        db.session.add(rl1)
        db.session.commit()

        
        response = self.client.get("/role_listings")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data[0]['role_id'], 234567891, msg= "data = %s" % data)

    def test_get_role_listing_with_details_empty(self):
                
        response = self.client.get("/role_listings")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data), 0, msg= "data = %s" % data)

    def test_get_single_role_listing(self):
             
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator="123456788",
            role_listing_updater="123456788")
        
        db.session.add(rl1)
        db.session.commit()

        response = self.client.get("/role_listings")
        self.assertEqual(response.status_code, 200)
        data = response.json
        url = "/role_listing_details/" + str(data[0]['role_listing_id'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['role_id'], 234567891, msg= "data = %s" % data)

    def test_get_single_role_listing_invalid(self):
                
        response = self.client.get("/role_listing_details/0")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['error'], 'Role Listing ID not found', msg= "data = %s" % data)


    def test_get_role_id_options(self):
        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )
        
        db.session.add(rd1)
        db.session.commit()

        response = self.client.get("/role_id_options")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data[0]['role_id'], 234567891, msg= "data = %s" % data)

    def test_get_role_id_options_empty(self):
                    
        response = self.client.get("/role_id_options")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data), 0, msg= "data = %s" % data)

    def test_role_details(self):
        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )
        
        db.session.add(rd1)
        db.session.commit()

        response = self.client.get("/role_details/234567891")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['role_id'], 234567891, msg= "data = %s" % data)

    def test_role_details_invalid(self):
        
        response = self.client.get("/role_details/0")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['error'], 'Role ID not found', msg= "data = %s" % data)

    def test_manager_options(self):

        sd1 = StaffDetails(
            staff_id=123456789,
            fname = "test",
            lname = "staff",
            dept = "test department",
            email = "test@email.com",
            phone = "12345678",
            sys_role="manager"
        )

        db.session.add(sd1)
        db.session.commit()

        response = self.client.get("/manager_options")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data[0]['staff_id'], 123456789, msg= "data = %s" % data)

    def test_manager_options_empty(self):
        
        response = self.client.get("/manager_options")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data), 0, msg= "data = %s" % data)

    def test_manager_options_non_manager(self):
        sd1 = StaffDetails(
            staff_id=123456789,
            fname = "test",
            lname = "staff",
            dept = "test department",
            email = "test@email.com",
            phone = "12345678",
            sys_role="staff"
        )

        db.session.add(sd1)
        db.session.commit()

        response = self.client.get("/manager_options")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data, [], msg= "data = %s" % data)


    def test_get_manager_details(self):

        sd1 = StaffDetails(
            staff_id=123456789,
            fname = "test",
            lname = "staff",
            dept = "test department",
            email = "test@email.com",
            phone = "12345678",
            sys_role="manager"
        )

        db.session.add(sd1)
        db.session.commit()

        response = self.client.get("/manager_details/123456789")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['staff_id'], 123456789, msg= "data = %s" % data)

    def test_get_manager_empty(self):
        
        response = self.client.get("/manager_details/123456789")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['error'], 'Manager not found', msg= "data = %s" % data)

    def test_skill_options(self):
        sd1 = SKILL_DETAILS(
            skill_id=345678918,
            skill_name="Recruitment",
            skill_description="Talent Attraction",
            skill_status="active"
        )

        db.session.add(sd1)
        db.session.commit()

        response = self.client.get("/skill_options")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data[0]['skill_id'], 345678918, msg= "data = %s" % data)
    
    def test_skill_options_empty(self):
            
        response = self.client.get("/skill_options")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data), 0, msg= "data = %s" % data)

    def test_associate_skills(self):
        # rs1 = ROLE_SKILLS(
        #     role_id=234567891,
        #     skill_id=345678918
        # )

        # db.add(rd1)
        # db.commit()

        response = self.client.post("/associate_skills", data=json.dumps({
            "role_id": 234567891,
            "skills": [345678918,345678919]
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['message'], 'Skills associated successfully', msg= "data = %s" % data)

    def test_associate_skills_empty(self):
            
        response = self.client.post("/associate_skills", data=json.dumps({
            "role_id": 234567891,
            "skills": []
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = response.json
        self.assertEqual(data['error'], 'Invalid data', msg= "data = %s" % data)


    def test_create_role_listing(self):
        

        response = self.client.post("/create_rolelisting", data=json.dumps({
            "role_id": 234567891,
            "role_listing_desc": "The Head, Talent Attraction",
            "role_listing_source": 123456788,
            "role_listing_open": "30-10-2023",
            "role_listing_close": "16-11-2023",
            "role_listing_creator": 123456787,
            "role_listing_updater": 123456788,
            "role_name": "Head, Talent Attraction"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data, 'Role listing created successfully.', msg= "data = %s" % data)


    def test_delete_role_listing(self):
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator=123456788,
            role_listing_updater=123456788)
        
        db.session.add(rl1)
        db.session.commit()

        response = self.client.get("/role_listings")
        self.assertEqual(response.status_code, 200)
        data = response.json
        role_listing = data[0]['role_listing_id']

        response = self.client.delete("/delete_rolelisting/"+str(role_listing))
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['message'], 'Role listing deleted successfully!', msg= "data = %s" % data)

    def test_delete_role_listing_invalid(self):
        response = self.client.delete("/delete_rolelisting/0")
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['message'], 'Role listing not found!', msg= "data = %s" % data)

    def test_view_role_applications(self):
       
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00",
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator=123456788,
            role_listing_updater=123456788)
        
        sd1 = StaffDetails(
            staff_id=123456789,
            fname = "test",
            lname = "staff",
            dept = "test department",
            email = "test@email.com",
            phone = "12345678",
            sys_role="manager"
        )

        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )

        db.session.add(sd1)
        db.session.add(rl1)
        db.session.add(rd1)
        db.session.commit()

        
        response = self.client.get("/role_listings")
        self.assertEqual(response.status_code, 200)
        data = response.json
        role_listing = data[0]['role_listing_id']

        ra1 = ROLE_APPLICATIONS(
            role_app_id = 123456789,
            role_listing_id = role_listing,
            staff_id = 123456789,
            role_app_status = "applied",
            app_reason = "test",
        )

        db.session.add(ra1)
        db.session.commit()

        response = self.client.get("/view_role_applications")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0]['staff_id'], 123456789, msg= "data = %s" % data)

    def test_view_role_applications_empty(self):
                
            response = self.client.get("/view_role_applications")
            self.assertEqual(response.status_code, 200)
            data = response.json
            self.assertEqual(len(data['data']), 0, msg= "data = %s" % data)

    def test_view_role_appliactions_by_rls(self):
        rl1 = RoleListing(
            role_id=234567891,
            role_listing_desc="The Head, Talent Attraction",
            role_listing_source =123456787,
            role_listing_open="2023-10-13 00:00:00", 
            role_listing_close="2023-12-30 00:00:00",
            role_listing_creator=123456788,
            role_listing_updater=123456788)
        
        sd1 = StaffDetails(
            staff_id=123456789,
            fname = "test",
            lname = "staff",
            dept = "test department",
            email = "test@email.com",
            phone = "12345678",
            sys_role="manager"
        )

        rd1 = RoleDetails(
            role_id=234567891,
            role_name="Head, Talent Attraction",
            role_description="The Head, Talent Attraction",
            role_status="active"
        )

        db.session.add(sd1)
        db.session.add(rl1)
        db.session.add(rd1)
        db.session.commit()

        
        response = self.client.get("/role_listings")
        self.assertEqual(response.status_code, 200)
        data = response.json
        role_listing = data[0]['role_listing_id']

        ra1 = ROLE_APPLICATIONS(
            role_app_id = 123456789,
            role_listing_id = role_listing,
            staff_id = 123456789,
            role_app_status = "applied",
            app_reason = "test",
        )

        db.session.add(ra1)
        db.session.commit()

        response = self.client.get("/view_role_applications_by_rls/123456787/"+str(role_listing))
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data['data'][0]['staff_id'], 123456789, msg= "data = %s" % data)

    def test_view_role_appliactions_by_rls_empty(self):
    
        response = self.client.get("/view_role_applications_by_rls/123456787/0")
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(len(data['data']), 0, msg= "data = %s" % data)


    def test_apply_role(self):
        response = self.client.post("/apply_role", data=json.dumps({
            "role_listing_id": 123456789,
            "staff_id": 123456789,
            "reason": "test"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data, 'Role application created successfully!', msg= "data = %s" % data)

    def test_withdraw_role(self):
        ra1 = ROLE_APPLICATIONS(
            role_app_id = 123456789,
            role_listing_id = 123456789,
            staff_id = 123456789,
            role_app_status = "applied",
            app_reason = "test",
        )

        db.session.add(ra1)
        db.session.commit()
        
        response = self.client.put("/withdraw_role", data=json.dumps({
            "role_listing_id": 123456789,
            "staff_id": 123456789,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data, 'Role application withdrawn successfully.', msg= "data = %s" % data)

    def test_withdraw_role_invalid(self):
        response = self.client.put("/withdraw_role", data=json.dumps({
            "role_listing_id": 123456789,
            "staff_id": 123456789,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertEqual(data['message'], 'Application not found!', msg= "data = %s" % data)

if __name__ == "__main__":
    unittest.main()

