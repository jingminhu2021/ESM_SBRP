import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                                <h1 className="text-white font-weight-bold">Skills</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>Skills</strong></span>
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
    else {
        const [skills, setSkills] = useState([]);
        const location = useLocation();

        useEffect(() => {
            axios.get('http://localhost:8000/api/skill/view_skills')
                .then(response => {
                    setSkills(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching skills:', error);
                });
        }, []);

        // Check if the 'created=true' parameter is present in the URL
        useEffect(() => {
            const searchParams = new URLSearchParams(location.search);
            const created = searchParams.get('created');
            if (created === 'true') {
                toast.success("Skill created successfully");
            }
        }, [location.search]);

        return (
            <div>
                {navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">Skills</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>Skills</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="site-section services-section bg-light block__62849 pt-4" id="next-section" style={{padding:'0'}}>
                    <div className="container">
                        <div className="text-right mb-5 mt-3" style={{padding:'0'}}>
                            <span className="mr-3">
                                <button className="btn btn-outline-primary btn-lg" type="button" onClick={() => window.location.href = '/createSkill'}>+ Create</button>
                            </span>
                            <button className="btn btn-outline-danger btn-lg" type="button" onClick={() => window.location.href = '/deleteSkills'}>- Delete</button>
                        </div>
                        <div className="row">
                            {skills ? skills.map(skill => (
                                <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={skill.skill_id}>
                                    <Link to={`/ViewSkill/${skill.skill_id}`} className="block__16443 text-center d-block" style={{transition: 'none', position: 'static', height: '100%'}}>
                                        <h3>{skill.skill_name}</h3>
                                        {skill.skill_description !== null ? (
                                            <p>
                                                <strong>Description:</strong> {skill.skill_description.length > 50
                                                    ? skill.skill_description.substring(0, 50) + '...' // Limit to 50 characters
                                                    : skill.skill_description}
                                            </p>
                                        ) : (
                                            <p>No description available</p>
                                        )}
                                        <p><strong>Status:</strong> {skill.skill_status}</p>
                                    </Link>
                                </div>
                            )) : (<p className="font-weight-bold" style={{ fontSize: '24px' }}>No skills found!</p>)}
                        </div>
                    </div>
                </section>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </div>
        );
    }
}
export default skill