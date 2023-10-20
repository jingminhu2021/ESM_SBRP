import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from '../components/navbar.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RoleListings() {
    
    const [rolelistings, setRoles] = useState([]);
    const location = useLocation();
    const api_link = 'http://localhost:8000/api/role/view_role_listings_hr'
    if (sessionStorage.getItem('sys_role') === 'manager') {
        api_link = 'http://localhost:8000/api/role/view_role_listings_manager/' + sessionStorage.getItem('staff_id')
    }
    useEffect(() => {
        axios.get(api_link)
        .then(response => {
            setRoles(response.data.data);
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

    // Filter active role listings and check date range
    const currentDate = new Date();
    console.log("date:" + currentDate)

    // const activeRoleListings = rolelistings.filter(rolelisting => {

    //     console.log("open date: " + new Date(rolelisting.role_listing_open))
    //     console.log("close date: " + new Date(rolelisting.role_listing_close))

    //     return (
    //         rolelisting.role_listing_status === 'active' &&
    //         new Date(rolelisting.role_listing_open) <= currentDate &&
    //         new Date(rolelisting.role_listing_close) >= currentDate
    //     );

        
    // });

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

            <div className="text-right mb-5 mt-3" style={{ padding: '0' }}>
                <span className="mr-3">
                    {sessionStorage.getItem('sys_role') === 'hr' && <button className="btn btn-primary btn-lg" type="button" onClick={() => window.location.href = '/createRoleListing'}>Create Role Listing</button>}
                </span>
                {sessionStorage.getItem('sys_role') === 'hr' && <button className="btn btn-danger btn-lg" type="button" onClick={() => window.location.href = '/updateRoleListing'}>Edit Role Listings</button>}
            </div>

            <section className="site-section services-section bg-light block__62849 pt-4" id="next-section" style={{ padding: '0' }}>
                <div className="container">
                    <div className="row">
                        
                        {/* {activeRoleListings.length > 0 ? activeRoleListings.map(rolelisting => ( */}
                        {rolelistings ? rolelistings.map(rolelisting => (
                            <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={rolelisting.role_listing_id}>
                                <Link to={`/ViewSingleRole/${rolelisting.role_listing_id}`} className="block__16443 text-center d-block font-weight-bold">
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