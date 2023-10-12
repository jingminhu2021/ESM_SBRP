import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';

var staff_id = sessionStorage.getItem('staff_id')
console.log("staff_id: " + staff_id)

function RoleListings() {
    // Check if HR is logged in

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

    // Display success message on successful update
    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        axios.get(`http://localhost:5003/view_role_single_listings/${role_listing_id}`, {
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
        })
        .catch(error => {
            console.error('Error fetching Role Listings:', error);
        });
    }, []);
    
    useEffect(() => {
        // Check if role_id is available before making the request
        if (role_id) {
            // Fetch matching and missing skills data from Flask API
            axios.get(`http://localhost:5003/matching_and_missing_skills/${role_id}/${staff_id}`)
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

    // Calculate the percentage of matched skills
    const totalSkills = skill_name.split(',').length; // Assuming skills are comma-separated
    const matchedSkills = matchingSkillsString.split(',').length;
    const percentage = (matchedSkills / totalSkills) * 100;
    
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
                                   <div className="progress">
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${percentage}%`}}
                                            aria-valuenow={percentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {percentage}% Match
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
                    </div>
                </div>
            </section>
        </div>
    );
}

export default RoleListings;
