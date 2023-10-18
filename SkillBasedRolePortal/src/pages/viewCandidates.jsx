import { useState, useEffect } from "react";
import navbar from "../components/navbar.jsx";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";

function viewStaffs() {
  // Check if HR is logged in
  if (sessionStorage.getItem('sys_role') != 'hr') {
    return (
        <div>
            {navbar()}
            <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">-</h1>
                            <div className="custom-breadcrumbs">
                                <a href="/">Home</a><span className="mx-2 slash">/</span>
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
    const [activeSkills, setActiveSkills] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [allStaffs, setAllStaffs] = useState([]);

    // Get all active skills when the component mounts
    useEffect(() => {
    const getActiveSkills = async () => {
        try {
            const response = await axios.get("http://localhost:5001/get_skills_by_status/active");
            if (response.status === 200) {
            setActiveSkills(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    getActiveSkills();
    }, []);

    // Get all staffs when the component mounts
    useState(() => {
        const getAllStaffs = async () => {
            try {
                const response = await axios.get("http://localhost:5001/get_all_staffs");
                if (response.status === 200) {
                    setStaffList(response.data.data);
                    setAllStaffs(response.data.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        getAllStaffs();
    }, []);

    // Handle Select change
    const handleSelectChange = (selectedOptions) => {
        // Display selected options
        setSelectedOptions(selectedOptions);
        // If no option is selected, display all staffs
        if (selectedOptions.length == 0){
            setStaffList(allStaffs);
            return
        }
        // Clear existing list
        setStaffList([]);

        // Fetch and add staff members for each selected skill
        for (let selected of selectedOptions) {
            var skill_id = selected.value;
            getStaffsBySkillsId(skill_id).then((data) => {
                if (data !== null) {
                    for (let staff of data) {
                        setStaffList((prevStaffList) => [...prevStaffList, staff]);       
                    }
                }   
            });
        }
    };

    const getStaffsBySkillsId = async (skillId) => {
        try {
            const response = await axios.post(
                "http://localhost:5001/get_staffs_by_skill_id", 
                { skill_id: skillId }, 
                { withCredentials: true}
            );
            return response.data.data;
        }
        catch (error) {
            console.log(error);
        }
    }

    console.log(staffList);

  return (
    <div>
      {navbar()}
      <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: "url(/images/hero_1.jpg)" }} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Staffs</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a><span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Staffs</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>  

      <section className="site-section p-sm-5" id="next-section">
        <div className="container">
          <div className="col-lg-8 mb-5 mb-lg-0 mx-auto">
            <p className="font-weight-bold h6 pb-2">Search Staffs by skill(s): </p>
            <Select
              options={activeSkills.map((skill) => ({ value: skill.skill_id, label: skill.skill_name }))}
              onChange={handleSelectChange}
              isMulti
              value={selectedOptions}
              placeholder="Search Skills..."
            />
            </div>

            <div className="row">
            {staffList.length === 0 ? (
                <div className="col-lg-8 mb-5 mb-lg-0 mx-auto text-center p-3">
                    <h5>No staff possess such power</h5>
                </div>
            ) : (
                <div className="col-lg-10 mt-5 mx-auto">
                    <table className="table table-striped table-bordered text-center">
                        <thead>
                            <tr>
                                <th>Staff ID</th>
                                <th>Staff Name</th>
                                <th>Department</th>
                                <th>System Role</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...new Set(staffList.map(staff => staff.staff_id))].map(uniqueStaffId => {
                                const uniqueStaff = staffList.find(staff => staff.staff_id === uniqueStaffId);

                                return (
                                    <tr key={uniqueStaff.staff_id}>
                                        <td>{uniqueStaff.staff_id}</td>
                                        <td>{uniqueStaff.fname} {uniqueStaff.lname}</td>
                                        <td>{uniqueStaff.dept}</td>
                                        <td>{uniqueStaff.sys_role}</td>
                                        <td>
                                            <Link to={`/viewSingleCandidate/${uniqueStaff.staff_id}`}>
                                                <button className="btn btn-primary">View</button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </div>
      </section>
    </div>
  );
  }
}

export default viewStaffs;
