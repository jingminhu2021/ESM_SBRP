import * as React from 'react'
import { useState } from "react";
import Select from 'react-select'
import navbar from '../components/navbar.jsx'

function viewRoles(){
    // Check if HR is logged in
    if (sessionStorage.getItem('sys_role') != 'hr') {
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
              <section className="site-section services-section" id="next-section">
                  <div className="container text-center">
                      <p className="font-weight-bold" style={{ fontSize: '24px' }}>You are not authorized to view this page!</p>
                  </div>
              </section>
          </div>
      )
  }
  else {
      const [rolelistings, setRoleListings] = useState([]);
      const location = useLocation();

      useEffect(() => {
          axios.get('http://localhost:5001/view_rolelistings')
              .then(response => {
                  setSkills(response.data.data);
              })
              .catch(error => {
                  console.error('Error fetching role listings:', error);
              });
      }, []);

      // Check if the 'created=true' parameter is present in the URL
      useEffect(() => {
          const searchParams = new URLSearchParams(location.search);
          const created = searchParams.get('created');
          if (created === 'true') {
              toast.success("Role Listing created successfully");
          }
      }, [location.search]);
  }

    return(
        <div>
          {navbar()}
          <section className="home-section section-hero overlay bg-image" style={{backgroundImage: 'url(/images/hero_1.jpg)'}} id="home-section">
              <div className="container">
              <div className="row align-items-center justify-content-center">
                  <div className="col-md-12">
                  <div className="mb-5 text-center">
                      <h1 className="text-white font-weight-bold">The Easiest Way To Get Your Dream Job</h1>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate est, consequuntur perferendis.</p>
                  </div>
                  <form className="search-jobs-form" onSubmit={handleSubmit}>
                      <div className="row mb-5">
                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                          <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} type="text" className="form-control form-control-lg" placeholder="Job title, Company..."></input>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                          <Select name="jobRegion" value={selectedRegion} placeholder="Select Region" options={region} onChange={handleDropdownChange} />
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                          <Select name="jobType" value={selectedType} placeholder="Select Job Type" isMulti={true} options={Job_Type} onChange={handleDropdownChange} />
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                          <button type="submit" className="btn btn-primary btn-lg btn-block text-white btn-search"><span className="icon-search icon mr-2"></span>Search Job</button>
                      </div>
                      </div>
                  </form>
                  </div>
              </div>
              </div>
      
              <a href="#next" className="scroll-button smoothscroll">
                  <span className=" icon-keyboard_arrow_down"></span>
              </a>
          </section>

          <section className="py-5 bg-image overlay-primary fixed overlay" id="next" style={{backgroundImage: 'url(/images/hero_1.jpg)'}}>
              <div className="container">
              <div className="row mb-5 justify-content-center">
                  <div className="col-md-7 text-center">
                  <h2 className="section-title mb-2 text-white">JobBoard Site Stats</h2>
                  <p className="lead text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita unde officiis recusandae sequi excepturi corrupti.</p>
                  </div>
              </div>
              <div className="row pb-0 block__19738 section-counter">

                  <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                      <strong className="number" data-number="1930">0</strong>
                  </div>
                  <span className="caption">Candidates</span>
                  </div>

                  <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                      <strong className="number" data-number="54">0</strong>
                  </div>
                  <span className="caption">Jobs Posted</span>
                  </div>

                  <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                      <strong className="number" data-number="120">0</strong>
                  </div>
                  <span className="caption">Jobs Filled</span>
                  </div>

                  <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                      <strong className="number" data-number="550">0</strong>
                  </div>
                  <span className="caption">Companies</span>
                  </div>

                  
              </div>
              </div>
          </section>

          <section className="site-section">
        <div className="container">

          <div className="row mb-5 justify-content-center">
            <div className="col-md-7 text-center">
              <h2 className="section-title mb-2">43,167 Job Listed</h2>
            </div>
          </div>
          
          <ul className="job-listings mb-5">
            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
              <div className="job-listing-logo">
                <img src="/images/job_logo_1.jpg" alt="Free Website Template by Free-Template.co" className="img-fluid"/>
              </div>

              <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                  <h2>Product Designer</h2>
                  <strong>Adidas</strong>
                </div>
                <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                  <span className="icon-room"></span> New York, New York
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-danger">Part Time</span>
                </div>
              </div>
              
            </li>
            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
              <div className="job-listing-logo">
                <img src="/images/job_logo_2.jpg" alt="Free Website Template by Free-Template.co" className="img-fluid"/>
              </div>

              <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                  <h2>Digital Marketing Director</h2>
                  <strong>Sprint</strong>
                </div>
                <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                  <span className="icon-room"></span> Overland Park, Kansas 
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>

            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
              <div className="job-listing-logo">
                <img src="/images/job_logo_3.jpg" alt="Free Website Template by Free-Template.co" className="img-fluid"/>
              </div>

              <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                  <h2>Back-end Engineer (Python)</h2>
                  <strong>Amazon</strong>
                </div>
                <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                  <span className="icon-room"></span> Overland Park, Kansas 
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>

            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
              <div className="job-listing-logo">
                <img src="/images/job_logo_4.jpg" alt="Free Website Template by Free-Template.co" className="img-fluid"/>
              </div>

              <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                  <h2>Senior Art Director</h2>
                  <strong>Microsoft</strong>
                </div>
                <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                  <span className="icon-room"></span> Anywhere 
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>

            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
              <div className="job-listing-logo">
                <img src="/images/job_logo_5.jpg" alt="Free Website Template by Free-Template.co" className="img-fluid"/>
              </div>

              <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                  <h2>Product Designer</h2>
                  <strong>Puma</strong>
                </div>
                <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                  <span className="icon-room"></span> San Mateo, CA 
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>
            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
              <div className="job-listing-logo">
                <img src="/images/job_logo_1.jpg" alt="Free Website Template by Free-Template.co" className="img-fluid"/>
              </div>

              <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                  <h2>Product Designer</h2>
                  <strong>Adidas</strong>
                </div>
                <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                  <span className="icon-room"></span> New York, New York
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-danger">Part Time</span>
                </div>
              </div>
              
            </li>
            <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
              <a href="job-single.html"></a>
              <div className="job-listing-logo">
                <img src="/images/job_logo_2.jpg" alt="Free Website Template by Free-Template.co" className="img-fluid"/>
              </div>

              <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                  <h2>Digital Marketing Director</h2>
                  <strong>Sprint</strong>
                </div>
                <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                  <span className="icon-room"></span> Overland Park, Kansas 
                </div>
                <div className="job-listing-meta">
                  <span className="badge badge-success">Full Time</span>
                </div>
              </div>
            </li>

            

            
          </ul>

          <div className="row pagination-wrap">
            <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
              <span>Showing 1-7 Of 43,167 Jobs</span>
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

export default viewRoles