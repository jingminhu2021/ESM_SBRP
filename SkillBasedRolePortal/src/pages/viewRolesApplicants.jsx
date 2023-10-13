import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function roleapplicants() {
    
    const [roleapplicants, setRolesApplicants] = useState([]);
    const location = useLocation();


    
    useEffect(() => {
        axios.get('http://localhost:5003/view_role_applications', {
       
    })
    .then(response => {
        setRolesApplicants(response.data.data);
        console.log(response.data.data);
    })
    .catch(error => {
        console.error('Error fetching Role Listings:', error);
    });
   
}, []);

// Check if the 'created=true' parameter is present in the URL
useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const created = searchParams.get('created');
    if (created === 'true') {
        toast.success("Role created successfully");
    }
}, [location.search]);
if (sessionStorage.getItem('sys_role') !== 'hr') {
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
        <div className="container" >
        
        <div className="row">
        {roleapplicants ? roleapplicants.map(roleapplicant => (
            <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={roleapplicants.role_listing_id}>
            <Link to={`/ViewSingleRole/${roleapplicant.role_listing_id}`} className="block__16443 text-center d-block">
            <h3>Role Listing ID: {roleapplicant.role_listing_id}</h3>
            <h3>Staff ID: {roleapplicant.staff_id}</h3>
            <h3>Staff Name: {roleapplicant.staff_name}</h3>
            <h3>Role Applied:{roleapplicant.role_name}</h3> 
            <p><strong>Current Department :</strong> {roleapplicant.staff_dept}</p>
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
                    
                    export default roleapplicants;
                    