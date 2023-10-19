import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';

function skill() {
    // Check if HR is logged in
    if (sessionStorage.getItem('sys_role') != 'hr') {
        return (
            <div>
                {navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">-</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <Link to="/ViewSkills">Skills</Link><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>-</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="site-section" id="next-section">
                    <div className="container text-center">
                        <p className="font-weight-bold" style={{ fontSize: '24px' }}>You are not authorized to view this page!</p>
                    </div>
                </section>
            </div>
        )
    }
    else {
        // Access the skillId parameter from the URL
        const { skillId } = useParams();
        const [skillName, setSkillName] = useState('');
        const [skillDescription, setSkillDescription] = useState('');
        const [skillStatus, setSkillStatus] = useState('');

        // Display success message on successful update
        const location = useLocation();
        const message = location.state?.message;

        useEffect(() => {
            axios.get('http://localhost:8000/api/skill/view_skill/' + skillId, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    setSkillName(response.data.data.skill_name);
                    setSkillDescription(response.data.data.skill_description);
                    setSkillStatus(response.data.data.skill_status);
                })
                .catch(error => {
                    console.error('Error fetching skill:', error);
                });
        }, []);

        return (
            <div>
                {navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">{skillName}</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <Link to="/ViewSkills">Skills</Link><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>{skillName}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="site-section" id="next-section">
                    <div className="container">
                        {(message) && (
                            <div className="alert alert-success" role="alert">{message}</div>
                        )}
                        <div className="row">
                            <div className="col-lg-8">
                                <h2 className="mb-4">{skillName}</h2>
                                {skillDescription !== null ? (
                                    <p>Description: {skillDescription}</p>
                                ) : (
                                    <p>No description available</p>
                                )}
                                <p>Status: {skillStatus}</p>
                                <Link to={`/UpdateSkill/${skillId}`} className="btn btn-info btn-md mt-4">Update Skill</Link> &nbsp;
                                <Link to={'/ViewSkills'} className="btn btn-secondary btn-md mt-4">Return to Skills</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default skill