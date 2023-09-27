import * as React from 'react'
import { useState } from "react";
import Select from 'react-select'
import navbar from '../components/navbar.jsx'

function postrole(){
    // const [selectedOption, setSelectedOption, selectedRegion, selectedType] = useState(null)
    
    // const region = [
    //     { value: '', label: 'Anywhere' },
    //     { value: 'San Francisco', label: 'San Francisco' },
    //     { value: 'Palo Alto', label: 'Palo Alto' },
    //     { value: 'New York', label: 'New York' },
    //     { value: 'Mahattan', label: 'Mahattan' },
    //     { value: 'Ontario', label: 'Ontario' },
    //     { value: 'Toronto', label: 'Toronto' },
    //     { value: 'Kansas', label: 'Kansas' },
    //     { value: 'Mountain View', label: 'Mountain View' }
    // ]

    // const Job_Type = [
    //   { value: 'Full Time', label: 'Full Time' },
    //   { value: 'Part Time', label: 'Part Time' },
    //   { value: 'Freelance', label: 'Freelance' },
    //   { value: 'Internship', label: 'Internship' },
    //   { value: 'Temporary', label: 'Temporary' }
    // ]


    // const [formData, setFormData] = useState({jobTitle: "",jobRegion: "",jobType: ""});
    // const handleChange = (event) => {
    //   const { name, value } = event.target;
    //   setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    // };
    // const  handleDropdownChange = (event) => {
    //   setSelectedOption(event.target);
    // };
    // const handleSubmit = (event) => {
    //   jobTitle: {FormData.jobTitle};
    //   jobRegion: {FormData.jobRegion.value};
    //   jobType: {FormData.jobTpe}
    // }

    return(
        <div>
          {navbar()}
            <section className="section-hero overlay inner-page bg-image" style="background-image: url('images/hero_1.jpg');" id="home-section">
              <div className="container">
                <div className="row">
                  <div className="col-md-7">
                    <h1 className="text-white font-weight-bold">Post A Role</h1>
                    <div className="custom-breadcrumbs">
                      <a href="#">Home</a> <span className="mx-2 slash">/</span>
                      <a href="#">Role</a> <span className="mx-2 slash">/</span>
                      <span className="text-white"><strong>Post a Role</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            
            <section className="site-section">
              <div className="container">

                <div className="row align-items-center mb-5">
                  <div className="col-lg-8 mb-4 mb-lg-0">
                    <div className="d-flex align-items-center">
                      <div>
                        <h2>Post A Role</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-light btn-md"><span className="icon-open_in_new mr-2"></span>Preview</a>
                      </div>
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-primary btn-md">Save Role</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-lg-12">
                    <form className="p-4 p-md-5 border rounded" method="post">
                      <h3 className="text-black mb-5 border-bottom pb-2">Role Details</h3>
                      
                      <div className="form-group">
                        <label for="job-id">Role ID</label>
                        <input type="text" className="form-control" id="job-id" placeholder="234567890"/>
                      </div>
                      <div className="form-group">
                        <label for="job-title">Role Title</label>
                        <input type="text" className="form-control" id="job-title" placeholder="Product Designer"/>
                      </div>

                      <div className="form-group">
                        <label for="job-type">Role Type</label>
                        <select className="selectpicker border rounded" id="job-type" data-style="btn-black" data-width="100%" data-live-search="true" title="Select Role Type">
                          <option>Part Time</option>
                          <option>Full Time</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label for="job-skills">Role Skills</label>
                        <select className="selectpicker border rounded" id="job-skills" data-style="btn-black" data-width="100%" data-live-search="true" title="Select Role Skills">
                          <option>IT</option>
                          <option>UI/UX</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label for="job-description">Role Description</label>
                        <div className="editor" id="editor-1">
                          <p>Enter Role Description</p>
                        </div>
                      </div>

                    </form>
                  </div>

                
                </div>
                <div className="row align-items-center mb-5">
                  
                  <div className="col-lg-4 ml-auto">
                    <div className="row">
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-light btn-md"><span className="icon-open_in_new mr-2"></span>Preview</a>
                      </div>
                      <div className="col-6">
                        <a href="#" className="btn btn-block btn-primary btn-md">Save Role</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </div>
    )
}

export default postrole