import * as React from 'react'
import { useState, useEffect } from "react";
import Select from 'react-select'
import navbar from '../components/navbar.jsx'
import SelectDate from '../components/select-date.jsx'
import RoleDescriptionEditor from '../components/role-description.jsx'

function postrole(){

  const [roleData, setRoleData] = useState({
    id: '', // Initialize with empty values
    title: '',
    createDate: '',
    endDate: '',
    description: '',
  });

  useEffect(() => {
    // Make a GET request to your Node.js server to fetch role data
    fetch('/api/roles') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setRoles(data); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Function to fetch existing role data when editing
  const fetchRoleData = async () => {
    // Replace with your API call to fetch role data
    const response = await fetch('/api/roles/123'); // Use the correct API endpoint
    const data = await response.json();
    setRoleData(data);
  };

  useEffect(() => {
    // Check if you are editing an existing role by examining the URL or a flag
    const isEditing = true; // Set this based on your logic
    if (isEditing) {
      fetchRoleData(); // Fetch existing role data
    }
  }, []);

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    // Replace with your API call to update role data
    await fetch('/api/updateRole/123', {
      method: 'PUT', // Use the correct HTTP method
      body: JSON.stringify(roleData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Handle success or error here
  };

    return(
        <div>
          {navbar()}
          <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: 'url(/images/hero_1.jpg)'}} id="home-section">
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
                    <form className="p-4 p-md-5 border rounded" onSubmit={handleFormSubmit}>
                      <h3 className="text-black mb-5 border-bottom pb-2">Role Details</h3>
                      
                      <div className="form-group">
                        <label for="job-id">Role ID</label>
                        <input type="text" className="form-control" id="job-id" placeholder="234567890"></input>
                      </div>
                      <div className="form-group">
                        <label for="job-title">Role Title</label>
                        <input type="text" className="form-control" id="job-title" placeholder="Product Designer"></input>
                      </div>
                    
                      <div className="form-group">
                        <label htmlFor="role-create-date">Role Creation Date</label>
                        {SelectDate()}
                      </div>

                      <div className="form-group">
                        <label htmlFor="role-end-date">Role Application End Date</label>
                        {SelectDate()}
                      </div>

                      {/* <div className="form-group">
                        <label htmlFor="job-skills">Role Skills</label>
                        <select className="selectpicker border rounded" id="job-skills" data-style="btn-black" data-width="100%" data-live-search="true" title="Select Role Skills">
                          <option>IT</option>
                          <option>UI/UX</option>
                        </select>
                      </div> */}

                      <div className="form-group">
                        <label htmlFor="job-description">Role Description</label>
                        {RoleDescriptionEditor()} 
                      </div>

                      <div className="form-group">
                        <label htmlFor="job-description">Role Description</label>
                        <RoleDescriptionEditor
                          value={roleData.description}
                          onChange={(newDescription) =>
                            setRoleData({ ...roleData, description: newDescription })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <button type="submit" className="btn btn-block btn-primary btn-md">
                          {isEditing ? 'Update Role' : 'Save Role'}
                        </button>
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