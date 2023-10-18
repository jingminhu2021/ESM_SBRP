import { React, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import navbar from '../components/navbar.jsx'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

function viewStaff(){
    // Check if HR , Manager is logged in
  if (sessionStorage.getItem('sys_role') !== 'hr' && sessionStorage.getItem('sys_role') !== 'manager') {
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
    //Access the skillId parameter from the URL
    const [skills, setSkills] = useState([])

    if(sessionStorage.getItem('status') == 'true'){
        var staff_id = sessionStorage.getItem('staffID')
        var fname = sessionStorage.getItem('s_fname')
        var lname = sessionStorage.getItem('s_lname')
        var email = sessionStorage.getItem('s_email')
        var phone = sessionStorage.getItem('s_phone')
        var dept = sessionStorage.getItem('s_dept')
    }else{
        const navigate = useNavigate();
        useEffect(() => {
            navigate('/')
        }, [])
    }

    useEffect(() => {
        fetchStaffSkills(staff_id).then((data) => {
            setSkills(data);
        });
    }, [])

    const fetchStaffSkills = async (staffId) => {
        try {
            var bodyFormData = new FormData();
            bodyFormData.append('staff_id', staffId);
            const response = await axios.post('http://localhost:5002/get_skills', bodyFormData, {withCredentials: true});
            return response.data.data;
        }
        catch (error) {
            console.error('Error fetching Skills:', error);
        }
    };

    return (
        <div>
            {navbar()}
            <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: 'url(/images/hero_1.jpg)'}} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="text-white font-weight-bold">{fname} {lname}</h1>
                            <div className="custom-breadcrumbs">
                                <a href="/">Home</a><span className="mx-2 slash">/</span>
                                <a href="/ViewCandidates">Staffs</a><span className="mx-2 slash">/</span>
                                <span className="text-white"><strong>{fname} {fname}</strong></span>
                            </div>                          
                        </div>
                    </div>
                </div>
            </section>   

            <div className="container">
                <div className="row mb-5 mt-5">   
                    <div className="row mb-4">
                        <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                            <strong className="d-block text-black">Staff Name</strong>
                            {fname}, {lname}
                        </div>
                        <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                            <strong className="d-block text-black">Department</strong>
                            {dept}
                        </div>
                        <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                            <strong className="d-block text-black">Email</strong>
                            {email}
                        </div>
                        <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                            <strong className="d-block text-black">Phone</strong>
                            {phone}
                        </div>
                        <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                            <strong className="d-block text-black mb-3">Staff Skills</strong>
                                {skills === null ? (
                                <span>(no skills listed)</span>
                                ) : (
                                <ul>
                                    {skills.map((skill) => (
                                    <li key={skill.skill_id}>
                                        <a href={`/viewSkill/${skill.skill_id}`}>{skill.skill_name}</a>
                                    </li>
                                    ))}
                                </ul>
                                )}
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
    }
}
export default viewStaff