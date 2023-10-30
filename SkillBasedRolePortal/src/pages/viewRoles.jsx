import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/navbar.jsx';
import Select from 'react-select'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RoleListings() {

    if (sessionStorage.getItem('sys_role') == null) {
        return (
            <div>
                {Navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">View Role Listings</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>view role listings</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="site-section services-section" id="next-section">
                    <div className="container text-center">
                        <p className="font-weight-bold" style={{ fontSize: '24px' }}>You are not authorized to view this page! Please login in </p>
                    </div>
                </section>
            </div>
        )
    }
    
    const [rolelistings, setRoles] = useState([]);
    const location = useLocation();
    var api_link = 'http://localhost:8000/api/role/view_role_listings_hr'
    // if (sessionStorage.getItem('sys_role') === 'manager') {
    //     api_link = 'http://localhost:8000/api/role/view_role_listings_manager/' + sessionStorage.getItem('staff_id')
    // }

    const navigate = useNavigate();
    const [selectedOption, setSelectedOption, selectedRegion, selectedType] = useState(null)
    const [skillList, setSkillList] = useState([])

    const getAllSkills = () =>{
        let api_endpoint_url = "http://localhost:8000/api/skill/view_skills"

        axios.get(api_endpoint_url)
        .then(function (response) {
            if (response.data.data != null){
                for (let i = 0; i < response.data.data.length; i++){
                  if (response.data.data[i].skill_status == "active"){
                    setSkillList(skillList => [...skillList, {label: response.data.data[i].skill_name, value: response.data.data[i].skill_name}])
                  }
                }
            }
        })
    }

    const [formData, setFormData] = useState({jobTitle: "",jobRegion: "",jobType: []});
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const skillSelect = []
    const handleDropdownChange = (event, selected) => {
        try{
          skillSelect.push({skillName: selected.option.value})  
        } catch (error){
        }
    };

    const handleSubmit = (event) => {
      event.preventDefault()
      navigate(
        "/searchRole",
        {state: {data:{roleTitle: formData.jobTitle, skill: skillSelect}}}
      )
    }


    useEffect(() => {
        axios.get(api_link)
        .then(response => {
            setRoles(response.data.data);
            console.log(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching Role Listings:', error);
        });
    }, []);

    // Check if the 'created=true' parameter is present in the URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const created = searchParams.get('created');
        if (created === 'true') {
            toast.success("Role created successfully");
        }
    }, [location.search]);

    // Filter active role listings and check date range
    const currentDate = new Date();
    console.log("date:" + currentDate)

    // const activeRoleListings = rolelistings.filter(rolelisting => {

    //     console.log("open date: " + new Date(rolelisting.role_listing_open))
    //     console.log("close date: " + new Date(rolelisting.role_listing_close))

    //     return (
    //         rolelisting.role_listing_status === 'active' &&
    //         new Date(rolelisting.role_listing_open) <= currentDate &&
    //         new Date(rolelisting.role_listing_close) >= currentDate
    //     );

        
    // });



    useEffect(() => {
      getAllSkills()
  }, [])

    return (
        <div>
            <Navbar />
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
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-md-12">
                        <div className="mb-5 text-center">
                            <h1 className="text-white font-weight-bold">The Easiest Way To Get Your Dream Role</h1>
                        </div>
                        <form className="search-jobs-form" onSubmit={handleSubmit}>
                            <div className="row mb-5">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4 mb-lg-0">
                                <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} type="text" className="form-control form-control-lg" placeholder="Job title..."></input>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4 mb-lg-0">
                                <Select class="jobSkill" styles={{ control: (baseStyles, state) => ({...baseStyles, padding: 4.5,}),}} name="jobSkill" value={selectedType} placeholder="Select skills" isMulti={true} options={skillList} onChange={handleDropdownChange} />
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4 mb-lg-0">
                                <button type="submit" className="btn btn-primary btn-lg btn-block text-white btn-search"><span className="icon-search icon mr-2"></span>Search Job</button>
                            </div>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="site-section services-section bg-light block__62849 pt-4" id="next-section" style={{ padding: '0' }}>
                <div className="container">
                    <div className="text-right mb-5 mt-3" style={{ padding: '0' }}>
                        <span className="mr-3">
                            {sessionStorage.getItem('sys_role') === 'hr' && <button className="btn btn-outline-primary btn-lg" type="button" onClick={() => window.location.href = '/createRoleListing'}>Create Role Listing</button>}
                        </span>
                        {sessionStorage.getItem('sys_role') === 'hr' && <button className="btn btn-outline-danger btn-lg" type="button" onClick={() => window.location.href = '/updateRoleListing'}>Edit Role Listings</button>}
                    </div>
                    <div className="row">
                        
                        {/* {activeRoleListings.length > 0 ? activeRoleListings.map(rolelisting => ( */}
                        {rolelistings ? rolelistings.map(rolelisting => (
                            <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={rolelisting.role_listing_id}>
                                <Link to={`/ViewSingleRole/${rolelisting.role_listing_id}`} className="block__16443 text-center d-block font-weight-bold" style={{transition: 'none', position: 'static', height: '100%'}}>
                                    <h3>{rolelisting.role_listing_id}</h3>
                                    <h3>{rolelisting.role_name}</h3> 
                                    {rolelisting.role_listing_desc !== null ? (
                                        <p>
                                            <strong>Description:</strong> {rolelisting.role_listing_desc.length > 50
                                            ? rolelisting.role_listing_desc.substring(0, 50) + '...' // Limit to 50 characters
                                            : rolelisting.role_listing_desc}
                                        </p>
                                    ) : (
                                        <p>No description available</p>
                                    )}
                                    <p><strong>Skill(s) Required:</strong> {rolelisting.skills_list.join(', ')}</p>
                                    <p><strong>Application Start Date :</strong> {rolelisting.role_listing_open}</p>
                                    <p><strong>Application End Date  :</strong> {rolelisting.role_listing_close}</p>
                                    {/* Only show Status for 'hr' users
                                    {sessionStorage.getItem('sys_role') === 'hr' && (
                                        rolelisting.role_listing_status === 'active' ? (
                                            <p className="text-success"><strong>Status:</strong> Active</p>
                                        ) : (
                                            <p className="text-danger"><strong>Status:</strong> Inactive</p>
                                        )
                                    )} */}
                                </Link>
                            </div>
                        )) : (<p className="font-weight-bold" style={{ fontSize: '24px' }}>No Active Role Listing Found!</p>)}
                    </div>
                </div>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
}

export default RoleListings;