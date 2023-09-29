import React, { useState, useEffect } from 'react'

function updateRoleListing({ onRoleDataChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Pass the updated form data to the parent component
    onRoleDataChange(formData);
  };

  return (
    // <div>
    //   <h2>Edit Role</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       name="roleTitle"
    //       placeholder="Role Title"
    //       value={formData.roleTitle}
    //       onChange={handleChange}
    //     />
    //     <textarea
    //       name="roleDescription"
    //       placeholder="Role Description"
    //       value={formData.roleDescription}
    //       onChange={handleChange}
    //     />
    //     <input
    //       type="date"
    //       name="roleOpenDate"
    //       placeholder="Role Open Date"
    //       value={formData.roleOpenDate}
    //       onChange={handleChange}
    //     />
    //     <input
    //       type="date"
    //       name="roleCloseDate"
    //       placeholder="Role Close Date"
    //       value={formData.roleCloseDate}
    //       onChange={handleChange}
    //     />
    //     <button type="submit">Update Role</button>
    //   </form>
    // </div>

    <div className="col-lg-12">
        <form className="p-4 p-md-5 border rounded">
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

            {/* <div className="form-group">
            <label htmlFor="job-description">Role Description</label>
            <RoleDescriptionEditor
                value={roleData.description}
                onChange={(newDescription) =>
                setRoleData({ ...roleData, description: newDescription })
                }
            />
            </div> */}

            {/* <div className="form-group">
            <button type="submit" className="btn btn-block btn-primary btn-md">
                {isEditing ? 'Update Role' : 'Save Role'}
            </button>
        </div> */}

        </form>
      </div>
  );
}

export default updateRoleListing;
