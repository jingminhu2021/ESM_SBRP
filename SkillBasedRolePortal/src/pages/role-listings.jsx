import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RoleListings() {
    
    const [rolelistings, setRoles] = useState([]);
    const location = useLocation();
    const [skills, setSkills] = useState([]);  // All available skills
    const [selectedSkills, setSelectedSkills] = useState([]);  // Selected skills
    
    useEffect(() => {
        axios.get('http://localhost:5100/view_role_listings', {
        params: {
            skills: selectedSkills
        }
    })
    .then(response => {
        setRoles(response.data.data);
        console.log(response.data.data);
    })
    .catch(error => {
        console.error('Error fetching Role Listings:', error);
    });
    axios.get('http://localhost:5100/view_skills')
    .then(response => {
        setSkills(response.data.data);
        console.log(response.data.data);
    })
    .catch(error => {
        console.error('Error fetching skills:', error);
    });
}, []);
useEffect(() => {
    console.log("Selected Skills:", selectedSkills);
}, [selectedSkills]);

// Before making the axios request, log the request URL and parameters
console.log("Fetching role listings with skills:", selectedSkills);
// Check if the 'created=true' parameter is present in the URL
useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const created = searchParams.get('created');
    if (created === 'true') {
        toast.success("Role created successfully");
    }
}, [location.search]);

return (
    <div>
    {navbar()}
    <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
    <div className="container">
    <div className="row">
    <div className="col-md-7">
    <h1 className="text-white font-weight-bold">Role Listings</h1>
    <div className="custom-breadcrumbs">
    <a href="/">Home</a><span className="mx-2 slash">/</span>
    <span className="text-white"><strong>Role Listings</strong></span>
    </div>
    </div>
    </div>
    </div>
    </section>
    
    <div className="text-right mb-5 mt-3" style={{ padding: '0' }}>
    <span className="mr-3">
    {sessionStorage.getItem('sys_role') === 'hr' && <button className="btn btn-primary btn-lg" type="button" onClick={() => window.location.href = '/createRole'}>+ Create</button>}
    </span>
    {sessionStorage.getItem('sys_role') === 'hr' && <button className="btn btn-danger btn-lg" type="button" onClick={() => window.location.href = '/deleteRole'}>- Delete</button>}
    </div>
    <div>
    {skills.map(skill => (
        <div key={skill.skill_id}>
        <input
        type="checkbox"
        value={skill.skill_name}
        checked={selectedSkills.includes(skill.skill_name)}
        onChange={(e) => {
            if (e.target.checked) {
                setSelectedSkills(prevSkills => [...prevSkills, skill.skill_name]);
            } else {
                setSelectedSkills(prevSkills => prevSkills.filter(s => s !== skill.skill_name));
            }
        }}
        />
        {skill.skill_name}
        </div>
        ))}
        </div>
        
        <section className="site-section services-section bg-light block__62849 pt-4" id="next-section" style={{ padding: '0' }}>
        <div className="container">
        
        <div className="row">
        {rolelistings ? rolelistings.map(rolelisting => (
            <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={rolelisting.role_listing_id}>
            <Link to={`/single-role/${rolelisting.role_listing_id}`} className="block__16443 text-center d-block">
            <h3>{rolelisting.role_id}</h3>
            <h3>{rolelisting.role_name}</h3>
            {rolelisting.role_listing_desc !== null ? (
                <p>
                <strong>Description:</strong> {rolelisting.role_listing_desc.length > 50
                    ? rolelisting.role_listing_desc.substring(0, 50) + '...' // Limit to 50 characters
                    : rolelisting.role_listing_desc}
                    </p>
                    ) : (
                        <p>No description available</p>
                        )}
                        <p><strong>Skill Required:</strong> {rolelisting.skills_list.join(", ")}</p>
                        <p><strong>Status:</strong> {rolelisting.role_listing_status}</p>
                        <p><strong>Open :</strong> {rolelisting.role_listing_open}</p>
                        <p><strong>Close :</strong> {rolelisting.role_listing_close}</p>
                        </Link>
                        </div>
                        )) : (<p className="font-weight-bold" style={{ fontSize: '24px' }}>No Role Listing found!</p>)}
                        </div>
                        </div>
                        </section>
                        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
                        </div>
                        );
                    }
                    
                    export default RoleListings;
                    
