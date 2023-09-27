import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';

function skill() {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/view_skills')
            .then(response => {
                setSkills(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching skills:', error);
            });
    }, []);
    
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

            <section className="site-section services-section bg-light block__62849" id="next-section">
                <div className="container">
                    <div className="row">
                        {skills ? skills.map(skill => (
                            <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={skill.skill_id}>
                                <Link to={`/ViewSkill/${skill.skill_id}`} className="block__16443 text-center d-block">
                                    <h3>{skill.skill_name}</h3>
                                    {skill.skill_description !== null ? (
                                        <p>Description: {skill.skill_description}</p>
                                    ) : (
                                        <p>No description available</p>
                                    )}
                                    <p>Status: {skill.skill_status}</p>
                                </Link>
                            </div>
                        )): (<div>No skills found</div>)}
                    </div>
                </div>
            </section>
        </div>
    );
}
export default skill