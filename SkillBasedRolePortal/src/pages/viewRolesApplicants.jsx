import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Button, Modal} from 'react-bootstrap'

function roleapplicants() {
    
    const [roleapplicants, setRolesApplicants] = useState([]);
    const location = useLocation();

    const [showModal, setShowModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const handleShowModal = (applicant) => {
        setSelectedApplicant(applicant);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }
    
    useEffect(() => {
        const fetchRoleApplicants = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/role/view_role_applications');
            const applicantsWithSkills = await Promise.all(response.data.data.map(async applicant => {
                const staffId = applicant.staff_id;
                const roleListingId = applicant.role_listing_id;
                const applicantSkills = await fetchApplicantSkills(staffId);
                const roleSkills = await fetchRoleSkills(roleListingId);
                let percentageMatch = 0;
                if (applicantSkills !== null){
                    percentageMatch = applicantSkills.filter(skill => roleSkills.includes(skill.skill_name)).length / roleSkills.length * 100;
                }
                return { ...applicant, applicantSkills, percentageMatch, roleSkills};
            }));
            setRolesApplicants(applicantsWithSkills);
          } catch (error) {
            console.error('Error fetching Role Listings:', error);
          }
        };
        fetchRoleApplicants();
      }, []);

    const fetchApplicantSkills = async (staffId) => {
        try {
            var bodyFormData = new FormData();
            bodyFormData.append('staff_id', staffId);
            const response = await axios.post('http://localhost:8000/api/profile/get_skills', bodyFormData, {withCredentials: true});
            return response.data.data;
        }
        catch (error) {
            console.error('Error fetching Skills:', error);
        }
    };

    const fetchRoleSkills = async (role_listing_id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/role/view_role_single_listings/${role_listing_id}`);
            return response.data.data.skills_list;
        }
        catch (error) {
            console.error('Error fetching Skills:', error);
        }
    };

// Check if the 'created=true' parameter is present in the URL
useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const created = searchParams.get('created');
    if (created === 'true') {
        toast.success("Role created successfully");
    }
}, [location.search]);
if (sessionStorage.getItem('sys_role') !== 'hr' && sessionStorage.getItem('sys_role') !== 'manager') {
    return (
        <div>
            {navbar()}
            <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">Role Applicants Listings</h1>
                            <div className="custom-breadcrumbs">
                                <a href="/">Home</a><span className="mx-2 slash">/</span>
                                <span className="text-white"><strong>Role Applicants Listings</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="site-section services-section" id="next-section">
                <div className="container text-center">
                    <p className="font-weight-bold" style={{ fontSize: '24px' }}>You are not authorized to view this page!</p>
                </div>
            </section>
        </div>
    )
  }

return (
    <div>
    {navbar()}
    <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
    <div className="container">
    <div className="row">
    <div className="col-md-7">
    <h1 className="text-white font-weight-bold">Role Applicants Listings</h1>
    <div className="custom-breadcrumbs">
    <a href="/">Home</a><span className="mx-2 slash">/</span>
    <span className="text-white"><strong>Role Applicants Listings</strong></span>
    </div>
    </div>
    </div>
    </div>
    </section>
    
    <div className="text-right mb-5 mt-3" style={{ padding: '0' }}>
    </div>
    
        <section className="site-section services-section bg-light block__62849 pt-4" id="next-section" style={{ padding: '0' }}>
        <div className="container">
        <div className="row">
        {roleapplicants ? roleapplicants.map(roleapplicant => (
            <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={roleapplicants.role_listing_id}>
            <div className="block__16443 text-center d-block" style={{transition: 'none', position: 'static', height: '100%'}}>
            <h3>Role Listing ID: {roleapplicant.role_listing_id}</h3>
            <h3>Staff ID: {roleapplicant.staff_id}</h3>
            <h3>Staff Name: {roleapplicant.staff_name}</h3>
            <p><strong>Role Applied: </strong>{roleapplicant.role_name}</p> 
            <p><strong>Current Department : </strong> {roleapplicant.staff_dept}</p>
            <p><strong>Source Manager ID: {roleapplicant.manager_staff_id}</strong></p>

            {/* Display Applicant Skills */}
            {roleapplicant.applicantSkills && roleapplicant.applicantSkills.length > 0 ? (
                <Link onClick={()=> handleShowModal(roleapplicant)} >
                <div className="bg-light text-info p-3">
                    <strong>Applicant Skills: </strong>
                    {roleapplicant.applicantSkills.map((skill, index) => (
                        <span key={skill.skill_id}>
                            {skill.skill_name}
                            {index !== roleapplicant.applicantSkills.length - 1 && ', '}
                        </span>
                    ))}
                    {sessionStorage.getItem('sys_role') === 'manager' && (
                    <>
                    <div className="progress mt-2">
                        <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${roleapplicant.percentageMatch}%`}}
                            aria-valuenow={roleapplicant.percentageMatch}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {roleapplicant.percentageMatch}%
                        </div>
                    </div>
                    <span className="text-secondary"><small>{roleapplicant.percentageMatch}% Skill Match to Role</small></span>
                    </>
                    )}
                </div>
                </Link>
            ) : (
                <Link onClick={()=> handleShowModal(roleapplicant)}>
                <div className="bg-light p-3 text-info ">
                    <strong>Applicant Skills: </strong>
                    No Skills
                </div>
                </Link>
            )}
            </div>  
        </div>
        )) : (<p className="font-weight-bold" style={{ fontSize: '24px' }}>No Role Listing found!</p>)}
        </div>
        </div>
        </section>

        {/* Show Model */}
        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>Skills Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="text-dark p-3" style={{backgroundColor: "silver"}}>
            <strong>Role Skill Required: </strong>
            <ul>
                {selectedApplicant && selectedApplicant.roleSkills && selectedApplicant.roleSkills.length > 0 ? (
                    selectedApplicant.roleSkills.map(skill => (
                        <li key={skill}>{skill}</li>
                    ))
                ) : (
                    <span>No Role Skills</span>
                    )}
            </ul>
            </div>

            {selectedApplicant && selectedApplicant.applicantSkills && selectedApplicant.applicantSkills.length > 0 ? (
            <div className="bg-light text-info p-3">
                <strong>Applicant Skills: </strong>
                <ul>
                {selectedApplicant.applicantSkills.map(skill => (
                    <li key={skill.skill_id}>{skill.skill_name}</li>
                ))}
                </ul>
                {sessionStorage.getItem('sys_role') === 'manager' && (
                    <>
                <div className="progress mt-2">
                <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${selectedApplicant.percentageMatch}%` }}
                    aria-valuenow={selectedApplicant.percentageMatch}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    {selectedApplicant.percentageMatch}%
                </div>
                </div>
                
                <div className="text-center">
                    <span className="text-secondary"><small>{selectedApplicant.percentageMatch}% Skill Match to Role</small></span>
                </div>
                </>
                )}
            </div>
          ) : (
            <div className="bg-light text-info p-3">
            <strong>Applicant Skills: </strong>
            No Skills
            </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                Close
            </Button>
        </Modal.Footer>
        </Modal>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
        );

}

export default roleapplicants;
                    