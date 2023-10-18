import { useState, useEffect } from "react";
import navbar from "../components/navbar.jsx";
import axios from "axios";
import { Link } from 'react-router-dom';

function StaffSkillList() {
  // Check if HR is logged in
  if (sessionStorage.getItem('sys_role') != 'hr') {
    return (
      <div>
        {navbar()}
        <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Update Staff Skills</h1>
                <div className="custom-breadcrumbs">
                  <a href="/">Home</a><span className="mx-2 slash">/</span>
                  <span className="text-white"><strong>Update Staff Skills</strong></span>
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
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
      // get staff with skills
      axios.get('http://localhost:5002/get_staff_skill', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setStaffList(response.data);
        })
        .catch(error => {
          console.error('Error fetching staff list:', error);
        });
    }, []);

    return (
      <div>
        {navbar()}
        <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Update Staff Skills</h1>
                <div className="custom-breadcrumbs">
                  <a href="/">Home</a><span className="mx-2 slash">/</span>
                  <span className="text-white"><strong>Update Staff Skills</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section" id="next-section">
          <div className="container">
            <div className="col-lg-10 mb-5 mb-lg-0 mx-auto mt-4">
              <p className="font-weight-bold">Staff List</p>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff, index) => (
                    <tr key={index}>
                      <td>{staff.staff_id}</td>
                      <td>{staff.staff_name}</td>
                      <td>{staff.dept}</td>
                      <td>{staff.sys_role}</td>
                      <td><Link to={`/UpdateStaffProfile/${staff.staff_id}`} className="btn btn-info btn-md">Update Skills</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    );
  };
}


export default StaffSkillList;
