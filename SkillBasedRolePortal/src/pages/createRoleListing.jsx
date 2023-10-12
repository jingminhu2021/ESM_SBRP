import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import navbar from '../components/navbar.jsx';
import { useNavigate } from 'react-router-dom';
// import showErrorToast from '../components/ErrorToast'; // Import the error popup component
// import showSuccessToast from './SuccessToast'; // Import the success popup component


var staff_id = sessionStorage.getItem('staff_id')
console.log("staff_id: " + staff_id)

function createRoleListing(){
  // Check if HR is logged in
  if (sessionStorage.getItem('sys_role') != 'hr') {
    return (
        <div>
            {navbar()}
            <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">Create Role Listing</h1>
                            <div className="custom-breadcrumbs">
                                <a href="/">Home</a><span className="mx-2 slash">/</span>
                                <span className="text-white"><strong>Create Role Listings</strong></span>
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
    const [formData, setFormData] = useState({
      role_id: '',
      role_name: '',
      role_listing_desc: '',
      role_listing_source: '',
      role_listing_open: '',
      role_listing_close: '',
      role_listing_creator: '',
      role_listing_updater: '',
      skill_id: [],
    });

    const [roleIDOptions, setRoleIDOptions] = useState([]); // Define roleIDOptions state
    const [selectedRole, setSelectedRole] = useState(''); // State to store the selected Role
    const [readOnlyFields, setReadOnlyFields] = useState(false); // Define readOnlyFields state
    const navigate = useNavigate();

    useEffect(() => {
      // Fetch all Role IDs from your database
      axios.get('http://localhost:5003/role_id_options')
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

    const handleRoleSelect = (selectedOption) => {
      setSelectedRole(selectedOption);

      // Fetch corresponding role details here
      if (selectedOption) {
        axios.get(`http://localhost:5003/role_details/${selectedOption.value}`)
          .then((response) => {
            if (response.status === 200) {
              const roleData = response.data;
              setFormData({
                ...roleData, // Populate all fields from roleData
                role_listing_open: formatDateForDisplay(roleData.role_listing_open), // Format date for display
                role_listing_close: formatDateForDisplay(roleData.role_listing_close), // Format date for display
              });
            } else {
              console.error('Error fetching Role details:', response.data);
            }
          })
          .catch((error) => {
            console.error('Error fetching Role details:', error);
          });
      }
    };

    const [managerOptions, setManagerOptions] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedManagerId, setSelectedManagerId] = useState('');

    useEffect(() => {
      // Fetch the manager options from your Flask API endpoint
      fetch('http://localhost:5003/manager_options')
        .then((response) => response.json())
        .then((data) => {
          // Convert the data to the format expected by react-select
          const options = data.map((manager) => ({
            value: manager.staff_id, // Set the staff_id as the value
            label: `${manager.fname} ${manager.lname}`, // Display the full name as the label
          }));
          setManagerOptions(options);
        })
        .catch((error) => {
          console.error('Error fetching manager options:', error);
        });
    }, []);

    const handleManagerSelect = (selectedOption) => {
      setSelectedManager(selectedOption);
      setSelectedManagerId(selectedOption.value); // Set the selected manager's staff_id
      // Set the role_listing_source in formData
      setFormData({
        ...formData,
        role_listing_source: parseInt(selectedOption.value),
      });
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
        
        // Check if the field being changed is "Close Date"
        if (name === 'role_listing_close') {
          // Convert the date strings to Date objects for comparison
          const openDate = new Date(formData.role_listing_open);
          const closeDate = new Date(formattedValue);
    
          // Compare "Close Date" with "Open Date" and show an error if it's before or equal to
          if (closeDate <= openDate) {
            alert('Close Date must be after Open Date');
            return; // Prevent setting the value
          }
        }
        
        setFormData({
          ...formData,
          [name]: formattedValue,
          role_listing_source: selectedManagerId,
          role_listing_creator: parseInt(staff_id),
          role_listing_updater: parseInt(staff_id),
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

      if (formData.role_listing_source === '') {
        errors.role_listing_source = 'Role Manager is required';
      }

      return errors;
    }

    const handleSubmit = async (event) => {
      event.preventDefault();

      const errors = checkEmpty();
      if (Object.keys(errors).length > 0) {
        console.error('Validation errors:', errors);

        // Prompt the user for missing fields
        const errorMessage = Object.values(errors).join('\n');
        alert(`Please be reminded that:\n\n${errorMessage}`);
        return;
      }
      
      // Rename the key from 'role_description' to 'role_listing_desc' if it exists
      if ('role_description' in formData) {
        formData.role_listing_desc = formData.role_description;
        delete formData.role_description;
      }

      console.log('Form Data:', formData);

      axios
        .post('http://localhost:5003/create_rolelisting', formData) // Replace with your Flask API endpoint
        .then((response) => {
          if (response.status === 200) {
            console.log('Role created successfully:', response.data);
            // navigate('/viewRoles?created=true');
          } else {
            console.error('Error creating role:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error saving data:', error);
        });
    }
    
  
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
                            readOnly={!!selectedRole} // Set to read-only if a role is selected
                            value={formData.role_name}
                            onChange={handleChange}
                          />
                        </div>

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
                            id="role_listing_desc"
                            name="role_listing_desc"
                            readOnly={!!selectedRole} // Set to read-only if a role is selected
                            value={formData.role_description}
                            onChange={handleChange}
                            style={{ height: '200px', width: '100%', overflowY: 'auto' }}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="manager-id">Role Manager</label>
                          <Select
                            options={managerOptions}
                            value={selectedManager}
                            onChange={handleManagerSelect}
                          />
                        </div>

                        <div className="form-group">
                          <button type="submit" className="btn btn-block btn-primary btn-md" onClick={handleSubmit}>Create Role Listing</button>
                        </div>
                    </form>
                  </div>
                </div>

              </div>
            </section>
        </div>    
    )
  }
}

export default createRoleListing