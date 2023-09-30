import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import navbar from '../components/navbar.jsx';
import { useNavigate } from 'react-router-dom';

var staff_id = sessionStorage.getItem('staff_id')
console.log("staff_id: " + staff_id)

function updateRoleListing() {
  // Check if HR is logged in
  if (sessionStorage.getItem('sys_role') !== 'hr') {
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
  } else {
    
    const [formData, setFormData] = useState({
      role_listing_id: '',
      role_listing_open: '',
      role_listing_close: '',
      role_listing_desc: '',
      role_listing_updater: '',
    });    

    const [roleListingOptions, setRoleListingOptions] = useState([]);
    const [selectedRoleListing, setSelectedRoleListing] = useState(null);
    const [roleDetails, setRoleDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
      // Fetch all role listing IDs from your database
      axios.get('http://localhost:5002/role_listing_id_option')
        .then((response) => {
          if (response.status === 200) {
            const options = response.data.map((roleListing) => ({
              value: roleListing,
              label: roleListing,
            }));
            console.log('Role Listing Options:', options); // Add this line
            setRoleListingOptions(options);
          } else {
            console.error('Error fetching Role Listing IDs:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching Role Listing IDs:', error);
        });
    }, []);

    const handleRoleListingSelect = (selectedOption) => {
      setSelectedRoleListing(selectedOption);
    
      if (selectedOption) {
        // Fetch corresponding role listing details here
        axios.get(`http://localhost:5002/role_listing_details/${selectedOption.value}`)
          .then((response) => {
            if (response.status === 200) {
              const roleListingData = response.data;
    
              // Extract role details and populate the form fields
              const {
                role_id,
                role_listing_desc,
                role_listing_source,
                role_listing_open,
                role_listing_close,
              } = roleListingData;
    
              // Format the date for display
              const formattedOpenDate = formatDateForDisplay(role_listing_open);
              const formattedCloseDate = formatDateForDisplay(role_listing_close);
              setRoleListingOpen(formattedOpenDate);
              setRoleListingClose(formattedCloseDate);
              setRoleListingDesc(roleListingData.role_listing_desc);
    
              setFormData({
                role_id,
                role_listing_desc,
                role_listing_source,
                role_listing_open: formattedOpenDate,
                role_listing_close: formattedCloseDate,
                role_listing_updater: staff_id,
              });
    
              // Now, fetch the role name from the role_details table
              axios.get(`http://localhost:5002/role_details/${role_id}`)
                .then((roleResponse) => {
                  if (roleResponse.status === 200) {
                    const roleData = roleResponse.data;
    
                    // Update the role name in the state
                    setRoleDetails({
                      role_name: roleData.role_name,
                      // Add other role-related fields here
                    });
                  } else {
                    console.error('Error fetching Role details:', roleResponse.data);
                  }
                })
                .catch((roleError) => {
                  console.error('Error fetching Role details:', roleError);
                });
            } else {
              console.error('Error fetching Role Listing details:', response.data);
            }
          })
          .catch((error) => {
            console.error('Error fetching Role Listing details:', error);
          });
      }
    };    

    const handleChange = (e) => {
      // Condition to determine if the fields should be read-only
      const readOnlyFields = !!selectedRoleListing;
    
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
    
        // Use the functional update form of setFormData to access the current state
        setFormData((prevData) => ({
          ...prevData,
          [name]: formattedValue,
          role_listing_updater: parseInt(staff_id),
        }));
      }
    };

    // Separate state for fields that can be edited
    const [roleListingOpen, setRoleListingOpen] = useState('');
    const [roleListingClose, setRoleListingClose] = useState('');
    const [roleListingDesc, setRoleListingDesc] = useState('');

    // Handle changes to editable fields
    const handleRoleListingOpenChange = (e) => {
      const value = e.target.value;
      setRoleListingOpen(value);

      // Update the formData state
      setFormData((prevData) => ({
        ...prevData,
        role_listing_open: value,
      }));
    };

    const handleRoleListingCloseChange = (e) => {
      const value = e.target.value;
      setRoleListingClose(value);

      // Update the formData state
      setFormData((prevData) => ({
        ...prevData,
        role_listing_close: value,
      }));
    };

    const handleRoleListingDescChange = (e) => {
      const value = e.target.value;
      setRoleListingDesc(value);

      // Update the formData state
      setFormData((prevData) => ({
        ...prevData,
        role_listing_desc: value,
      }));
    };

    

    // Function to format a date for display (from "Sat, 30 Sep 2023 00:00:00 GMT" to "dd-MM-yyyy")
    const formatDateForDisplay = (dateString) => {
      if (!dateString) return ''; // Handle empty date
      const dateObj = new Date(dateString);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits for month
      const day = dateObj.getDate().toString().padStart(2, '0'); // Ensure two digits for day
    
      // Format it as yyyy-MM-dd
      return `${year}-${month}-${day}`;
    };

    // Function to format a date for server (from dd-MM-yyyy to yyyy-MM-dd)
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

    const handleUpdate = async (event) => {
      event.preventDefault();

      const errors = checkEmpty();
      if (Object.keys(errors).length > 0) {
        console.error('Validation errors:', errors);
        return;
      }

      console.log('Form Data:', formData);

      // Ensure you send the role_listing_id along with the other data to the server
      const updatedData = {
        ...formData,
        role_listing_id: selectedRoleListing.value, // Pass the selected role_listing_id
      };

      console.log('Updated Form Data:', updatedData);

      // Make the PUT request to update the role listing
      // Send the updated data to the server
    axios
      .put('http://localhost:5002/update_rolelisting', updatedData) // Adjust the API endpoint
      .then((response) => {
        if (response.status === 200) {
          console.log('Role Listing updated successfully:', response.data);
          // You can handle success actions here, such as showing a success message
        } else {
          console.error('Error updating Role Listing:', response.data);
          // Handle errors here, such as showing an error message
        }
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        // Handle errors here, such as showing an error message
      });
    };

    return (
      <div>
        {navbar()}
        <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Update Role</h1>
                <div className="custom-breadcrumbs">
                  <a href="#">Role Listings</a> <span className="mx-2 slash">/</span>
                  <a href="#">Role</a> <span className="mx-2 slash">/</span>
                  <span className="text-white"><strong>Update Role</strong></span>
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
                    <h2>Update Role</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-lg-12">
                <form className="p-4 p-md-5 border rounded" onSubmit={handleUpdate}>
                  <h3 className="text-black mb-5 border-bottom pb-2">Role Details</h3>

                  <div className="form-group">
                    <label htmlFor="job-listing-id">Role Listing ID</label>
                    <Select
                      options={roleListingOptions}
                      value={selectedRoleListing} // Use selectedRoleListing here
                      onChange={(selectedOption) => handleRoleListingSelect(selectedOption)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="job-id">Role ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="role_id"
                      name="role_id"
                      value={formData.role_id}
                      readOnly={!!selectedRoleListing} // Set to read-only if a role listing ID is selected
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="job-title">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="role_name"
                      name="role_name"
                      value={roleDetails.role_name} // Display the role name from roleDetails
                      readOnly={!!selectedRoleListing} // Set to read-only if a role listing ID is selected
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role_listing_open">Role Application Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="role_listing_open"
                      name="role_listing_open"
                      value={roleListingOpen}
                      onChange={handleRoleListingOpenChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role_listing_close">Role Application End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="role_listing_close"
                      name="role_listing_close"
                      value={roleListingClose}
                      onChange={handleRoleListingCloseChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role_listing_desc">Role Description</label>
                    <textarea
                      className="form-control"
                      id="role_listing_desc"
                      name="role_listing_desc"
                      value={roleListingDesc}
                      onChange={handleRoleListingDescChange}
                      style={{ height: '200px', width: '100%', overflowY: 'auto' }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="manager-id">Manager</label>
                    <input
                      type="text"
                      className="form-control"
                      id="role_listing_source"
                      name="role_listing_source"
                      value={formData.role_listing_source}
                      readOnly={!!selectedRoleListing} // Set to read-only if a role listing ID is selected
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-block btn-primary btn-md" onClick={handleUpdate}>Update Role</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default updateRoleListing;
