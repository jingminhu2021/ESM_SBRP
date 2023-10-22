import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from '../components/navbar.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RoleListings() {
    
    const [rolelistings, setRoles] = useState([]);
    const location = useLocation();
    var api_link = 'http://localhost:8000/api/role/view_role_listings_hr'
    if (sessionStorage.getItem('sys_role') === 'manager') {
        api_link = 'http://localhost:8000/api/role/view_role_listings_manager/' + sessionStorage.getItem('staff_id')
    }
    useEffect(() => {
        axios.get(api_link)
        .then(response => {
            setRoles(response.data.data);
            
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
    
    const currentDate = new Date();
    //current date as dd/mm/yyyy
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentdate= currentDay + "/" + currentMonth + "/" + currentYear;
    console.log("current date: " +currentdate)
    
    
    
    return (
        <div>
        <Navbar />
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
        
        
        
        <section className="site-section services-section bg-light block__62849 pt-4" id="next-section" style={{ padding: '0' }}>
        <div className="container">
        <div className="text-right mb-5 mt-3" style={{ padding: '0' }}>
        <span className="mr-3">
        {sessionStorage.getItem('sys_role') === 'hr' && <button className="btn btn-outline-primary btn-lg" type="button" onClick={() => window.location.href = '/createRoleListing'}>Create Role Listing</button>}
        </span>
        {sessionStorage.getItem('sys_role') === 'hr' && <button className="btn btn-outline-danger btn-lg" type="button" onClick={() => window.location.href = '/updateRoleListing'}>Edit Role Listings</button>}
        </div>
        <div className="row">
        {/* append to filter rolelistings.role_listing_close>= currentDate */}
        {rolelistings ? rolelistings.filter(rolelisting => {
            // Assuming currentdate and role_listing_close are in dd/mm/yy format as strings
            const currentDateParts = currentdate.split('/');
            const closeDateParts = rolelisting.role_listing_close.split('/');
            
            // Create Date objects from the date parts
            const currentDate = new Date(`20${currentDateParts[2]}`, currentDateParts[1] - 1, currentDateParts[0]);
            const closeDate = new Date(`20${closeDateParts[2]}`, closeDateParts[1] - 1, closeDateParts[0]);
            
            // Compare the dates
            return rolelisting.role_listing_status === 'active' && currentDate <= closeDate;
        }).map(rolelisting => (
            <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={rolelisting.role_listing_id}>
            <Link to={`/ViewSingleRole/${rolelisting.role_listing_id}`} className="block__16443 text-center d-block font-weight-bold" style={{transition: 'none', position: 'static', height: '100%'}}>
            <h3>{rolelisting.role_listing_id}</h3>
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
                        <p><strong>Skill(s) Required:</strong> {rolelisting.skills_list.join(', ')}</p>
                        <p><strong>Application Start Date :</strong> {rolelisting.role_listing_open}</p>
                        <p><strong>Application End Date  :</strong> {rolelisting.role_listing_close}</p>
                        {/* Only show Status for 'hr' users */}
                        {sessionStorage.getItem('sys_role') === 'hr' && (
                            rolelisting.role_listing_status === 'active' ? (
                                <p className="text-success"><strong>Status:</strong> Active</p>
                                ) : (
                                    <p className="text-danger"><strong>Status:</strong> Inactive</p>
                                    )
                                    )}
                                    </Link>
                                    </div>
                                    )) : (<p className="font-weight-bold" style={{ fontSize: '24px' }}>No Active Role Listing Found!</p>)}
                                    </div>
                                    </div>
                                    </section>
                                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
                                    </div>
                                    );
                                }
                                
                                export default RoleListings;