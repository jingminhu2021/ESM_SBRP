import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Form, Button, Modal, Alert } from 'react-bootstrap'
import navbar from '../components/navbar.jsx';
import axios from 'axios';

var staff_id = sessionStorage.getItem('staff_id')
console.log("staff_id: " + staff_id)

function RoleListings() {
    // Check if user is logged in
    if (sessionStorage.getItem('status') !== 'true') {
        return (
            <div>
                {navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">Role Listing</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <Link to="/ViewRoles">Role Listings</Link><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>-</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="site-section" id="next-section">
                    <div className="container text-center">
                        <p className="font-weight-bold" style={{ fontSize: '24px' }}>Please login to view this page!</p>
                    </div>
                </section>
            </div>
        )
    }
    else {
        // Access the role_listing_id parameter from the URL
        const { role_listing_id } = useParams();
        const [role_id, setRoleId] = useState('');
        const [role_name, setRoleDetailName] = useState('');
        const [role_listing_desc, setRolelistingDescription] = useState('');
        const [role_listing_status, setRolelistingStatus] = useState('');
        const [role_listing_open, setRolelistingOpen] = useState('');
        const [role_listing_close, setRolelistingClose] = useState('');
        const [skill_name, setSkillName] = useState('');
        const [matchingSkillsString, setMatchingSkillsString] = useState('');
        const [missingSkillsString, setMissingSkillsString] = useState('');
        const [role_listing_source, setRolelistingSource] = useState('');

        // Display success message on successful update
        const location = useLocation();
        const message = location.state?.message;

        const [roleapplicants, setRolesApplicants] = useState([]);

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
            axios.get(`http://localhost:8000/api/role/view_role_single_listings/${role_listing_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    const roleData = response.data.data;
                    // Ensure role_id is retrieved and set properly
                    if (roleData && roleData.role_id) {
                        setRoleId(roleData.role_id);
                    }
                    setRoleDetailName(response.data.data.role_name);
                    setRolelistingDescription(response.data.data.role_listing_desc);
                    setRolelistingStatus(response.data.data.role_listing_status);
                    setRolelistingOpen(response.data.data.role_listing_open);
                    setRolelistingClose(response.data.data.role_listing_close);
                    const skillsList = response.data.data.skills_list;
                    setSkillName(skillsList.length > 0 ? skillsList.join(", ") : "None");
                    setRolelistingSource(response.data.data.role_listing_source);

                    checkDate(response.data.data.role_listing_close);
                    checkStatus(response.data.data.role_listing_status);
                })
                .catch(error => {
                    console.error('Error fetching Role Listings:', error);
                });
        }, []);

        useEffect(() => {
            // Check if role_id is available before making the request
            if (role_id) {
                // Fetch matching and missing skills data from Flask API
                axios.get(`http://localhost:8000/api/role/matching_and_missing_skills/${role_id}/${staff_id}`)
                    .then(response => {
                        // Extract data from the response
                        const { matching_skills, missing_skills } = response.data;

                        // Join matching and missing skills into strings
                        const matchingSkillsStr = matching_skills.join(', ');
                        const missingSkillsStr = missing_skills.join(', ');

                        // Update state with the matching and missing skills strings
                        setMatchingSkillsString(matchingSkillsStr);
                        setMissingSkillsString(missingSkillsStr);
                    })
                    .catch(error => {
                        console.error('Error fetching matching and missing skills:', error);
                    });
            }
        }, [role_id, staff_id]);

        // Fetch applicants for the role listing
        useEffect(() => {
            const fetchData = async () => {
                // Check if role_listing_source is available
                if (role_listing_source) {
                    try {
                        const response = await axios.get(`http://localhost:8000/api/role/view_role_applications_by_rls/${role_listing_source}/${role_listing_id}`);
                        const applicantsWithSkills = await Promise.all(response.data.data.map(async applicant => {
                            const staffId = applicant.staff_id;
                            const roleListingId = applicant.role_listing_id;
                            const applicantSkills = await fetchApplicantSkills(staffId);
                            const roleSkills = await fetchRoleSkills(roleListingId);
                            let percentageMatch = 0;
                            if (applicantSkills !== null) {
                                percentageMatch = applicantSkills.filter(skill => roleSkills.includes(skill.skill_name)).length / roleSkills.length * 100;
                            }
                            return { ...applicant, applicantSkills, percentageMatch, roleSkills };
                        }));
                        setRolesApplicants(applicantsWithSkills);
                    } catch (error) {
                        console.error('Error fetching Role Listings:', error);
                    }
                }
            };
        
            fetchData();
        }, [role_listing_source]);


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

        var applications = [];
        const [applied, setApplied] = useState(false);
        const [appMsg, setAppMsg] = useState('');
        const [datePassed, setDatePassed] = useState(false);
        const [statusActive, setStatusActive] = useState(true);
        const [sourceApply, setSourceApply] = useState(false);
        const [reason, setReason] = useState('');

        // Check if today's date is past closing date - do not display apply + withdraw role buttons
        function checkDate(endDate) {
            const today = new Date();

            const [day, month, year] = endDate.split('/');
            const givenDate = new Date(`${year}-${month}-${day}`);

            // Compare the dates
            if (today > givenDate) {
                setDatePassed(true);
            }
            else {
                setDatePassed(false);
            }
        }

        // check if role listing status is active
        function checkStatus(status) {
            if (status === 'active') {
                setStatusActive(true);
            }
            else {
                setStatusActive(false);
            }
        }

        useEffect(() => {
            // See if user has applied for the role already
            axios.get('http://localhost:8000/api/role/view_role_applications', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    applications = response.data.data;
                    for (var application of applications) {
                        console.log("app", application);
                        // Check if user applied for the role
                        if (application.staff_id == staff_id && application.role_listing_id == role_listing_id) {
                            setApplied(true);
                            setReason(application.app_reason);
                            break;
                        }
                        // Check if logged in user is the creator of listing
                        if (application.manager_staff_id == staff_id) {
                            console.log(application.manager_staff_id);
                            setSourceApply(true);
                            break;
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching applications:', error);
                });
        }, []);

        // Display modal options (apply role)
        const [showApply, setShowApply] = useState(false);
        const handleCloseApply = () => setShowApply(false);
        const handleShowApply = () => setShowApply(true);
        const [errorClass, setErrorClass] = useState("d-none")
        const [errors, setErrors] = useState({ reason: '' });

        //Display modal options (view role)
        const [showView, setShowView] = useState(false);
        const handleCloseView = () => setShowView(false);
        const handleShowView = () => setShowView(true);

        //Display modal options (withdraw role)
        const [showWithdraw, setShowWithdraw] = useState(false);
        const handleCloseWithdraw = () => setShowWithdraw(false);
        const handleShowWithdraw = () => setShowWithdraw(true);

        const handleReasonChange = async (event) => {
            const reasonInterest = await event.target.value;
            setReason(reasonInterest);
            // Clear error message and make sure it only execute once
            if (errors.reason !== '') {
                setErrors({ ...errors, reason: '' });
            }
        }

        // Check if the reason field is empty (apply role)
        function checkEmpty() {
            const errors = {};
            if (reason.trim() === '') {
                errors.reason = 'Reason for interest is required';
            }

            if (Object.keys(errors).length > 0) {
                setErrors(errors);
                return true;
            }
            return false;
        }

        // When submit application form (apply role)
        const handleSubmitApply = async (e) => {
            e.preventDefault();

            if (checkEmpty()) return;

            const applicationData = {
                role_listing_id: role_listing_id,
                staff_id: staff_id,
                reason: reason,
            };
            console.log("app data", applicationData)
            const response = await axios.post('http://localhost:8000/api/role/apply_role', applicationData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log(response)
                setApplied(true);
                setShowWithdraw(false);
                setAppMsg("You have successfully applied for this role!");
            } else {
                console.log(response)
                setErrorClass("d-block")
            }
        }

        // When click confirm withdraw (withdraw role)
        const handleWithdrawal = async (e) => {
            e.preventDefault();

            const withdrawData = {
                role_listing_id: role_listing_id,
                staff_id: staff_id,
            };

            const response = await axios.put('http://localhost:8000/api/role/withdraw_role', withdrawData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log(response)
                setApplied(false);
                setShowApply(false);
                setAppMsg("You have successfully withdrawn from this role.");
            } else {
                console.log(response)
                setErrorClass("d-block")
            }
        }

        // Calculate the percentage of matched skills
        const totalSkills = skill_name.split(',').length; // Assuming skills are comma-separated
        const matchedSkills = matchingSkillsString.trim() === '' ? 0 : matchingSkillsString.split(',').length;
        const percentage = (matchedSkills / totalSkills) * 100;
        console.log(totalSkills, matchedSkills, percentage)
        return (
            <div>
                {navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">{role_name}</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <Link to="/ViewRoles">Role Listings</Link><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>{role_name}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="site-section" id="next-section">
                    <div className="container">
                        {message && (
                            <div className="alert alert-success" role="alert">{message}</div>
                        )}
                        {appMsg && (
                            <div className="alert alert-success" role="alert">{appMsg}</div>
                        )}
                        <div className="row">
                            <div className="col-lg-8">
                                <h2 className="mb-4">{role_name}</h2>
                                {role_listing_desc !== null ? (
                                    <p><strong>Description:</strong> {role_listing_desc}</p>
                                ) : (
                                    <p><strong>Description:</strong> No description available</p>
                                )}
                                <p><strong>Skill(s) Required:</strong> {skill_name}</p>
                                <p><strong>Opening Date:</strong> {role_listing_open}</p>
                                <p><strong>Closing Date:</strong> {role_listing_close}</p>
                                <p><strong>Status:</strong> {role_listing_status}</p>

                                {sessionStorage.getItem('sys_role') === 'staff' && (
                                    <div className="col-lg-8" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                                        <p><strong>Your Role-Skill Match</strong></p>
                                        <div className="progress" style={{position: 'relative'}}>
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{ width: `${percentage}%` }}
                                                aria-valuenow={percentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <span style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: 'black'}}>{percentage}% Match</span>
                                            </div>
                                        </div>

                                        <p style={{ marginTop: '20px' }}><strong>Matched Skill(s):</strong> {matchingSkillsString}</p>
                                        <p><strong>Missing Skill(s):</strong> {missingSkillsString}</p>
                                    </div>
                                )}

                                {sessionStorage.getItem('sys_role') === 'hr' && (
                                    <button
                                        className="btn btn-primary btn-lg"
                                        type="button"
                                        onClick={() => {
                                            const updateUrl = `/updateRoleListing?role_listing_id=${role_listing_id}`;
                                            window.location.href = updateUrl;
                                        }}
                                        style={{ marginRight: '20px' }}
                                    >
                                        Edit Role Listing
                                    </button>
                                )}
                                <button className="btn btn-secondary btn-lg" onClick={() => window.location.href = '/ViewRoles'} >
                                    Return to Role Listings
                                </button>
                            </div>
                            {datePassed && applied && !sourceApply && (
                                <div className="col-lg-4">
                                    <Button className="btn btn-block btn-info btn-md" onClick={handleShowView}>
                                        View Application
                                    </Button>

                                    <Modal show={showView} onHide={handleCloseView} aria-labelledby="contained-modal-title-vcenter" centered>
                                        <Modal.Header>
                                            <Modal.Title>Application Form</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form.Group className="mb-3" controlId="reasonForInterest">
                                                <Form.Label>Reason for Application</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    name="reason"
                                                    placeholder="Tell us why you are interested in applying for this role..."
                                                    value={reason}
                                                    readOnly
                                                    style={{
                                                        maxHeight: '200px',
                                                        resize: 'none',
                                                        overflowY: 'auto'
                                                    }}
                                                />
                                            </Form.Group>
                                            <Button variant="secondary" onClick={handleCloseView}>
                                                Close
                                            </Button>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            )}
                            {!datePassed && applied && !sourceApply && statusActive && (
                                <div className="col-lg-4">
                                    <Button className="btn btn-block btn-info btn-md" onClick={handleShowView}>
                                        View Application
                                    </Button>

                                    <Modal show={showView} onHide={handleCloseView} aria-labelledby="contained-modal-title-vcenter" centered>
                                        <Modal.Header>
                                            <Modal.Title>Application Form</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form.Group className="mb-3" controlId="reasonForInterest">
                                                <Form.Label>Reason for Application</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    name="reason"
                                                    placeholder="Tell us why you are interested in applying for this role..."
                                                    value={reason}
                                                    readOnly
                                                    style={{
                                                        maxHeight: '200px',
                                                        resize: 'none',
                                                        overflowY: 'auto'
                                                    }}
                                                />
                                            </Form.Group>
                                            <Button variant="secondary" onClick={handleCloseView}>
                                                Close
                                            </Button>
                                        </Modal.Body>
                                    </Modal>

                                    <Button className="btn btn-block btn-danger btn-md" onClick={handleShowWithdraw}>
                                        Withdraw Application
                                    </Button>

                                    <Modal show={showWithdraw} onHide={handleCloseWithdraw} aria-labelledby="contained-modal-title-vcenter" centered>
                                        <Modal.Header>
                                            <Modal.Title>Withdraw Application</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Alert variant="danger" className={errorClass}>An error occurred while withdrawing from this role.</Alert>
                                            <p>Are you sure you want to withdraw your application?</p>
                                            <Button variant="secondary" onClick={handleCloseWithdraw}>
                                                Cancel
                                            </Button>
                                            <Button variant="danger" className="ml-2" onClick={handleWithdrawal}>
                                                Withdraw
                                            </Button>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            )}
                            {!datePassed && !applied && !sourceApply && statusActive && (
                                <div className="col-lg-4">
                                    <Button className="btn btn-block btn-primary btn-md" onClick={handleShowApply}>
                                        Apply Now!
                                    </Button>

                                    <Modal show={showApply} onHide={handleCloseApply} aria-labelledby="contained-modal-title-vcenter" centered>
                                        <Modal.Header>
                                            <Modal.Title>Application Form</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form onSubmit={handleSubmitApply}>
                                                {(errors.reason) && (
                                                    <Alert variant="danger" className="d-block">{errors.reason}</Alert>
                                                )}
                                                <Alert variant="danger" className={errorClass}>An error occurred while applying for this role.</Alert>
                                                <Form.Group className="mb-3" controlId="reasonForInterest">
                                                    <Form.Label>Reason for Application</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={4}
                                                        name="reason"
                                                        placeholder="Tell us why you are interested in applying for this role..."
                                                        value={reason}
                                                        onChange={handleReasonChange}
                                                        style={{
                                                            maxHeight: '200px',
                                                            resize: 'vertical',
                                                            overflowY: 'auto'
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Button variant="secondary" onClick={handleCloseApply}>
                                                    Close
                                                </Button>
                                                <Button className="ml-2" variant="primary" type="submit">
                                                    Submit
                                                </Button>
                                            </Form>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            )}

                            <section className="site-section services-section bg-light block__62849 pt-4 mt-5" id="next-section" style={{ padding: '0' }}>
                            <div className="container">
                                <h4 className="text-center mb-3"><strong>List of Applicants</strong></h4>
                                <div className="row">
                                {roleapplicants && roleapplicants.length > 0 ? (
                                    roleapplicants.map(roleapplicant => (
                                    <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={roleapplicant.role_listing_id}>
                                        <div className="block__16443 text-center d-block" style={{ transition: 'none', position: 'static', height: '100%' }}>
                                        <h3>Staff ID: {roleapplicant.staff_id}</h3>
                                        <h3>Staff Name: {roleapplicant.staff_name}</h3>
                                        <p><strong>Current Department: </strong> {roleapplicant.staff_dept}</p>
                                        <p><strong>Source Manager ID: {roleapplicant.manager_staff_id}</strong></p>

                                        {/* Display Applicant Skills */}
                                        {roleapplicant.applicantSkills && roleapplicant.applicantSkills.length > 0 ? (
                                            <Link onClick={() => handleShowModal(roleapplicant)}>
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
                                                        style={{ width: `${roleapplicant.percentageMatch}%` }}
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
                                            <Link onClick={() => handleShowModal(roleapplicant)}>
                                            <div className="bg-light p-3 text-info ">
                                                <strong>Applicant Skills: </strong>
                                                No Skills
                                            </div>
                                            </Link>
                                        )}
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                    <p className="text-center" style={{ fontSize: '18px' }}>- No one applied for this role -</p>
                                )}
                                </div>
                            </div>
                            </section>
                        </div>
                    </div>
                </section>

                {/* Show Model for application listings*/}
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
            </div>
        );
    }
}

export default RoleListings;
