import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';

function RoleListings() {
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
                                    <Link to="/role-listings">Role Listing</Link><span className="mx-2 slash">/</span>
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
        // Access the role_listing_id parameter from the URL
        const { role_listing_id } = useParams();
        //const [role_listing_name, setRolelisting] = useState('');
        const [role_name, setRoleDetailName] = useState('');
        const [role_listing_desc, setRolelistingDescription] = useState('');
        const [role_listing_status, setRolelistingStatus] = useState('');
        const [role_listing_open, setRolelistingOpen] = useState('');
        const [role_listing_close, setRolelistingClose] = useState('');

        // Display success message on successful update
        const location = useLocation();
        const message = location.state?.message;

        useEffect(() => {
            axios.get('http://localhost:5100/view_role_single_listings/' + role_listing_id, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    //setRoleName(response.data.data.role_listing_name);
                  
                    setRoleDetailName(response.data.data.role_name)
                    setRolelistingDescription(response.data.data.role_listing_desc);
                    setRolelistingStatus(response.data.data.role_listing_status);
                    setRolelistingOpen(response.data.data.role_listing_open);
                    setRolelistingClose(response.data.data.role_listing_close);
                })
                .catch(error => {
                    console.error('Error fetching Role Listings:', error);
                });
        }, []);

        return (
            <div>
                {navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                {/* <h1 className="text-white font-weight-bold">{role_listing_name}</h1> */}
                                <h1 className="text-white font-weight-bold">{role_name}</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <Link to="/role-listings">Role Listings</Link><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>{role_name}</strong></span>
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
                                <h2 className="mb-4">{role_name}</h2>
                                {role_listing_desc!== null ? (
                                    <p>Description: {role_listing_desc}</p>
                                ) : (
                                    <p>No description available</p>
                                )}
                                <p><b>Opening Date:</b> {role_listing_open}</p>
                                <p><b>Closing Date:</b> {role_listing_close}</p>
                                <p><b>Status :</b> {role_listing_status}</p>
                                <Link to={`/update_rolelisting/${role_listing_id}`} className="btn btn-info btn-md mt-4">Update Role Listings</Link> &nbsp;
                                <Link to={'/role-listings'} className="btn btn-secondary btn-md mt-4">Return to Role Listings</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default RoleListings