import * as React from 'react'
import { useState } from "react";
import Select from 'react-select'
import navbar from '../components/navbar.jsx'

function displayrole(){
    const [selectedOption, setSelectedOption, selectedRegion, selectedType] = useState(null)
    
    const region = [
        { value: '', label: 'Anywhere' },
        { value: 'San Francisco', label: 'San Francisco' },
        { value: 'Palo Alto', label: 'Palo Alto' },
        { value: 'New York', label: 'New York' },
        { value: 'Mahattan', label: 'Mahattan' },
        { value: 'Ontario', label: 'Ontario' },
        { value: 'Toronto', label: 'Toronto' },
        { value: 'Kansas', label: 'Kansas' },
        { value: 'Mountain View', label: 'Mountain View' }
    ]

    const Job_Type = [
      { value: 'Full Time', label: 'Full Time' },
      { value: 'Part Time', label: 'Part Time' },
      { value: 'Freelance', label: 'Freelance' },
      { value: 'Internship', label: 'Internship' },
      { value: 'Temporary', label: 'Temporary' }
    ]


    const [formData, setFormData] = useState({jobTitle: "",jobRegion: "",jobType: ""});
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };
    const  handleDropdownChange = (event) => {
      setSelectedOption(event.target);
    };
    const handleSubmit = (event) => {
      jobTitle: {FormData.jobTitle};
      jobRegion: {FormData.jobRegion.value};
      jobType: {FormData.jobTpe}
    }

    return(
        <div>
          {navbar()}
            <section className="site-section" style={{backgroundImage: 'url(/images/header.jpg)'}}>
              <div className="container">
                <div className="row align-items-center mb-5">
                  <div className="col-lg-8 mb-4 mb-lg-0">
                    <div className="d-flex align-items-center">
                      <div className="border p-2 d-inline-block mr-3 rounded">
                        <img src="images/job_logo_5.jpg" alt="Image"/>
                      </div>
                      <div>
                        <h2>Product Designer</h2>
                        <div>
                          <span className="m-2"><span className="icon-clock-o mr-2"></span><span className="text-primary">Full Time</span></span>
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
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis illum fuga eveniet. Deleniti asperiores, commodi quae ipsum quas est itaque, ipsa, dolore beatae voluptates nemo blanditiis iste eius officia minus.</p>
                      <p>Velit unde aliquam et voluptas reiciendis non sapiente labore, deleniti asperiores blanditiis nihil quia officiis dolor vero iste dolore vel molestiae saepe. Id nisi, consequuntur sunt impedit quidem, vitae mollitia!</p>
                    </div>

                    <div className="row mb-5">
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-light btn-md"><span className="icon-heart-o mr-2 text-danger"></span>Save Role</a>
                      </div>
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-primary btn-md">Apply Now</a>
                      </div>
                    </div>

                  </div>
                  <div className="col-lg-4">
                    <div className="bg-light p-3 border rounded mb-4">
                      <h3 className="text-primary  mt-3 h5 pl-3 mb-3 ">Role Summary</h3>
                      <ul className="list-unstyled pl-3 mb-0">
                        <li className="mb-2"><strong className="text-black">Published on:</strong> April 14, 2019</li>
                        <li className="mb-2"><strong className="text-black">Vacancy:</strong> 20</li>
                        <li className="mb-2"><strong className="text-black">Experience:</strong> 2 to 3 year(s)</li>
                        <li className="mb-2"><strong className="text-black">Salary:</strong> $60k - $100k</li>
                        <li className="mb-2"><strong className="text-black">Application Deadline:</strong> April 28, 2019</li>
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
            </section>

            <section className="site-section" id="next">
              <div className="container">

                <div className="row mb-5 justify-content-center">
                  <div className="col-md-7 text-center">
                    <h2 className="section-title mb-2">22,392 Related Roles</h2>
                  </div>
                </div>
                
                <ul className="job-listings mb-5">
                  <li className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center">
                    <a href="role-single.html"></a>
                    <div className="job-listing-logo">
                      <img src="images/job_logo_1.jpg" alt="Image" className="img-fluid"/>
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
                    <a href="role-single.html"></a>
                    <div className="job-listing-logo">
                      <img src="images/job_logo_2.jpg" alt="Image" className="img-fluid"/>
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
                    <a href="role-single.html"></a>
                    <div className="job-listing-logo">
                      <img src="images/job_logo_3.jpg" alt="Image" className="img-fluid"/>
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
                    <a href="role-single.html"></a>
                    <div className="job-listing-logo">
                      <img src="images/job_logo_4.jpg" alt="Image" className="img-fluid"/>
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
                    <a href="role-single.html"></a>
                    <div className="job-listing-logo">
                      <img src="images/job_logo_5.jpg" alt="Image" className="img-fluid"/>
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
                    <a href="role-single.html"></a>
                    <div className="job-listing-logo">
                      <img src="images/job_logo_1.jpg" alt="Image" className="img-fluid"/>
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
                    <a href="role-single.html"></a>
                    <div className="job-listing-logo">
                      <img src="images/job_logo_2.jpg" alt="Image" className="img-fluid"/>
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

export default displayrole