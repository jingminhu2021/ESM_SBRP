import * as React from 'react'
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link
import axios from "axios";
import Select from 'react-select'
import navbar from '../components/navbar.jsx'

function viewSingleRole(){
  // Check if HR is logged in
  if (sessionStorage.getItem('sys_role') != 'hr') {
    return (
        <div>
            {navbar()}
            <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">Role Listing</h1>
                            <div className="custom-breadcrumbs">
                                <a href="/">Home</a><span className="mx-2 slash">/</span>
                                <Link to="/ViewSkills">Role Listings</Link><span className="mx-2 slash">/</span>
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
    // Access the roleListingId parameter from the URL
    const { roleListingId } = useParams();

    // Define state variables to store role listing details
    const [roleListing, setRoleListing] = useState({
        role_id: "",
        role_listing_desc: "",
        role_listing_source: "",
        role_listing_open: "",
        role_listing_close: "",
        role_listing_creator: "",
        role_listing_ts_create: "",
        role_listing_updater: "",
        role_listing_ts_update: "",
    });

    // Define state variable to store role listings
    const [roleListings, setRoleListings] = useState([]);

    // Display success message on successful update
    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        axios.get('http://localhost:5000/view_rolelisting/' + roleListingId, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
              const data = response.data.data;
              setRoleListing({
                  role_id: data.role_id,
                  role_listing_desc: data.role_listing_desc,
                  role_listing_source: data.role_listing_source,
                  role_listing_open: data.role_listing_open,
                  role_listing_close: data.role_listing_close,
                  role_listing_creator: data.role_listing_creator,
                  role_listing_ts_create: data.role_listing_ts_create,
                  role_listing_updater: data.role_listing_updater,
                  role_listing_ts_update: data.role_listing_ts_update,
              });
          })
          .catch((error) => {
              console.error('Error fetching role listing:', error);
          });
  }, [roleListingId]); // Add roleListingId to the dependency array to fetch when it changes

}

    return(
        <div>
          {navbar()}
            <section className="site-section">
            {roleListing.role_id && (
              <div className="container">
                <div className="row align-items-center mb-5">
                  <div className="col-lg-8 mb-4 mb-lg-0">
                    <div className="d-flex align-items-center">
                      <div className="border p-2 d-inline-block mr-3 rounded">
                        <img src="images/job_logo_5.jpg" alt="Image"/>
                      </div>
                      <div>
                        <h2>Role Title Hard Coded</h2>
                        <div>
                          <span className="m-2"><span className="icon-clock-o mr-2"></span><span className="text-primary">{roleListing.role_listing_creator}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-light btn-md"><span className="icon-heart-o mr-2 text-danger"></span>Save Role</a>
                      </div>
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-primary btn-md">Apply Now</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="mb-5">
                      <figure className="mb-5"><img src="images/job_single_img_1.jpg" alt="Image" className="img-fluid rounded"/></figure>
                      <h3 className="h5 d-flex align-items-center mb-4 text-primary"><span className="icon-align-left mr-3"></span>Role Description</h3>
                      <p>{roleListing.role_listing_desc}</p>
                    </div>

                    {/* <div className="row mb-5">
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-light btn-md"><span className="icon-heart-o mr-2 text-danger"></span>Save Role</a>
                      </div>
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-primary btn-md">Apply Now</a>
                      </div>
                    </div> */}

                    <div className="row mb-5">
                      <div className="col-6">
                        <button className="btn btn-primary btn-lg" type="button" onClick={() => window.location.href = '/post-role'}>+ Create New Role</button>
                      </div>
                      <div className="col-6">
                        <button className="btn btn-danger btn-lg" type="button" onClick={() => window.location.href = '/delete-role'}>- Delete Existing Role</button>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="bg-light p-3 border rounded mb-4">
                      <h3 className="text-primary  mt-3 h5 pl-3 mb-3 ">Role Summary</h3>
                      <ul className="list-unstyled pl-3 mb-0">
                        <li className="mb-2"><strong className="text-black">Published on:</strong>{roleListing.role_listing_open}</li>
                        <li className="mb-2"><strong className="text-black">Role ID:</strong>{roleListing.role_id}</li>
                        <li className="mb-2"><strong className="text-black">Role ID:</strong>{roleListing.role_id}</li>
                        <li className="mb-2"><strong className="text-black">Application Deadline:</strong>{roleListing.role_listing_close}</li>
                      </ul>
                    </div>

                    <div className="bg-light p-3 border rounded">
                      <h3 className="text-primary  mt-3 h5 pl-3 mb-3 ">Share</h3>
                      <div className="px-3">
                        <a href="#" className="pt-3 pb-3 pr-3 pl-0"><span className="icon-facebook"></span></a>
                        <a href="#" className="pt-3 pb-3 pr-3 pl-0"><span className="icon-twitter"></span></a>
                        <a href="#" className="pt-3 pb-3 pr-3 pl-0"><span className="icon-linkedin"></span></a>
                        <a href="#" className="pt-3 pb-3 pr-3 pl-0"><span className="icon-pinterest"></span></a>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
            </section>

            <section className="site-section" id="next">
              <div className="container">

                <div className="row mb-5 justify-content-center">
                  <div className="col-md-7 text-center">
                    <h2 className="section-title mb-2">22,392 Related Roles</h2>
                  </div>
                </div>
                
                <ul className="job-listings mb-5">
                  {roleListings.map((role) => (
                      <li key={role.role_listing_id} className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                          <a href="role-single.html"></a>
                          <div className="job-listing-logo">
                              <img src="images/job_logo_1.jpg" alt="Image" className="img-fluid"/>
                          </div>

                          <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                              <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                                  <h2>{role.role_id}</h2>
                                  <strong>{role.role_listing_desc}</strong>
                              </div>
                              <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                                  <span className="icon-room"></span> {role.role_listing_source}
                              </div>
                              <div className="job-listing-meta">
                                  <span className="badge badge-success">{role.role_listing_open}</span>
                              </div>
                          </div>
                      </li>
                  ))}
                </ul>

                <div className="row pagination-wrap">
                  <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
                    <span>Showing 1-7 Of 22,392 Roles</span>
                  </div>
                  <div className="col-md-6 text-center text-md-right">
                    <div className="custom-pagination ml-auto">
                      <a href="#" className="prev">Prev</a>
                      <div className="d-inline-block">
                      <a href="#" className="active">1</a>
                      <a href="#">2</a>
                      <a href="#">3</a>
                      <a href="#">4</a>
                      </div>
                      <a href="#" className="next">Next</a>
                    </div>
                  </div>
                </div>

              </div>
            </section>
        </div>
    )
}

export default viewSingleRole