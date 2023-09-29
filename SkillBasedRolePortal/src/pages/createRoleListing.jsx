import * as React from 'react'
import axios from 'axios'
import { useState, useEffect } from "react"
import Select from 'react-select'
import navbar from '../components/navbar.jsx'
import { useNavigate, Link} from 'react-router-dom';

function createRoleListing(){

  const [formData, setFormData] = useState({
    role_id: '',
    role_name: '',
    role_listing_desc: '',
    role_listing_source: '',
    role_listing_open: '',
    role_listing_close: '',
  });

  const [roleIDOptions, setRoleIDOptions] = useState([]); // Define roleIDOptions state
  const [selectedRole, setSelectedRole] = useState(''); // State to store the selected Role
  const [readOnlyFields, setReadOnlyFields] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Role IDs from your database
    axios.get('http://localhost:5002/role_id_options')
      .then((response) => {
        if (response.status === 200) {
          const options = response.data.map((role) => ({
            value: role,
            label: role,
          }));
          setRoleIDOptions(options);
        } else {
          console.error('Error fetching Role IDs:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching Role IDs:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedRole) {
      // Fetch corresponding role details based on selected role ID
      axios.get(`http://localhost:5002/role_details/${selectedRole.value}`) // Replace with your Flask API endpoint
        .then((response) => {
          if (response.status === 200) {
            const roleData = response.data;
            setFormData({
              ...formData,
              role_id: roleData.role_id,
              role_name: roleData.role_name,
              role_description: roleData.role_description,
              // Add other fields as needed
            });
            setReadOnlyFields(true);
          } else {
            console.error('Error fetching Role details:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching Role details:', error);
        });
    } else {
      setReadOnlyFields(false);
    }
  }, [selectedRole]);

  const handleRoleSelect = (selectedOption) => {
    setSelectedRole(selectedOption);
  };

  // Function to format a date for display (from yyyy-MM-dd to dd-MM-yyyy)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''; // Handle empty date
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      // Format it as dd-MM-yyyy
      return `${day}-${month}-${year}`;
    }
    // Return the original value if it doesn't match the expected format
    return dateString;
  };

  const formatDateForServer = (dateString) => {
    if (!dateString) return ''; // Handle empty date
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Format it as yyyy-MM-dd
      return `${year}-${month}-${day}`;
    }
    // Return the original value if it doesn't match the expected format
    return dateString;
  };

  const handleChange = (e) => {
    if (!readOnlyFields) {
      const { name, value } = e.target;
  
      // If the input is a date field, format the value as "yyyy-MM-dd"
      const formattedValue =
        e.target.type === 'date' ? formatDateForServer(value) : value;
  
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    }
  };

  function checkEmpty() {
    const errors = {};

    if (formData.role_id === '') {
      errors.role_id = 'Role ID is required';
    }
    if (formData.role_name === '') {
      errors.role_name = 'Role Name is required';
    }
    if (formData.role_listing_open === '') {
      errors.role_listing_open = 'Role Application Start Date is required';
    }

    return errors;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = checkEmpty();
    if (Object.keys(errors).length > 0) {
      console.error('Validation errors:', errors);
      return;
    }

    console.log('Form Data:', formData);

    axios
      .post('http://localhost:5002/create_rolelisting', formData) // Replace with your Flask API endpoint
      .then((response) => {
        if (response.status === 200) {
          console.log('Role created successfully:', response.data);
          navigate('/viewRoles?created=true');
        } else {
          console.error('Error creating role:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };



    return(
        <div>
          {navbar()}
          <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: 'url(/images/hero_1.jpg)'}} id="home-section">
              <div className="container">
                <div className="row">
                  <div className="col-md-7">
                    <h1 className="text-white font-weight-bold">Create Role</h1>
                    <div className="custom-breadcrumbs">
                      <a href="#">Role Listings</a> <span className="mx-2 slash">/</span>
                      <a href="#">Role</a> <span className="mx-2 slash">/</span>
                      <span className="text-white"><strong>Create Role</strong></span>
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
                        <h2>Create Role</h2>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-5">
                  <div className="col-lg-12">
                    <form className="p-4 p-md-5 border rounded" onSubmit={handleSubmit}>
                        <h3 className="text-black mb-5 border-bottom pb-2">Role Details</h3>
                        
                        <div className="form-group">
                          <label htmlFor="job-id">Role ID</label>
                          <Select
                            options={roleIDOptions}
                            value={selectedRole}
                            onChange={handleRoleSelect}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="job-title">Role Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="role_name"
                            name="role_name"
                            readOnly={readOnlyFields}
                            value={readOnlyFields ? formData.role_name : ''}
                            onChange={handleChange}
                          />
                        </div>

                        {/* <div className="form-group">
                        <label htmlFor="job-skills">Role Skills</label>
                        <select className="selectpicker border rounded" id="job-skills" data-style="btn-black" data-width="100%" data-live-search="true" title="Select Role Skills">
                            <option>IT</option>
                            <option>UI/UX</option>
                        </select>
                        </div> */}

                        <div className="form-group">
                          <label htmlFor="role_listing_open">Role Application Start Date</label>
                          <input
                            type="date" // Use type "date" for calendar selection
                            className="form-control"
                            id="role_listing_open"
                            name="role_listing_open"
                            value={formatDateForDisplay(formData.role_listing_open)} // Format for display
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="role_listing_close">Role Application End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="role_listing_close"
                            name="role_listing_close"
                            value={formatDateForDisplay(formData.role_listing_close)}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="role_listing_desc">Role Description</label>
                          <textarea
                            className="form-control"
                            id="role_description"
                            name="role_description"
                            readOnly={readOnlyFields}
                            value={readOnlyFields ? formData.role_description : ''}
                            onChange={handleChange}
                            style={{ height: '250px', width: '100%', overflowY: 'auto' }}
                          />
                        </div>

                        <div className="form-group">
                          <button type="submit" className="btn btn-block btn-primary btn-md" onClick={handleSubmit}>Save Role</button>
                        </div>
                    </form>
                  </div>
                </div>

                <div className="row align-items-center mb-5">
                  
                  <div className="col-lg-4 ml-auto">
                    <div className="row">
                      <div className="col-6">
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </div>    
    )
}

export default createRoleListing