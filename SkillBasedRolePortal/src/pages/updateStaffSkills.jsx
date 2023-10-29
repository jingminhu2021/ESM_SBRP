import { React, useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"
import navbar from '../components/navbar.jsx'
import axios from 'axios'
import Select from 'react-select'
import Row from 'react-bootstrap/Row';
import { Form, Button, Modal, Badge } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function UpdateStaffSkills() {
    // Check if HR is logged in
    if (sessionStorage.getItem('sys_role') != 'hr') {
        return (
            <div>
                {navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">Staff Profile</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <Link to="/StaffSkillList">Update Staff Skills</Link><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>Staff Profile</strong></span>
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
        // staff details
        const { staff_id } = useParams()
        const [fname, setFname] = useState('')
        const [lname, setLname] = useState('')
        const [dept, setDept] = useState('')
        const [email, setEmail] = useState('')
        const [phone, setPhone] = useState('')

        const [skill, setSkill] = useState([])
        const [allSkill, setAllSkill] = useState([])

        const [showUpdateSkill, setShowUpdateSkill] = useState(false)
        const [showAddSkill, setShowAddSkill] = useState(false)

        const handleAddSkillClose = () => setShowAddSkill(false)
        const handleAddSkillShow = () => setShowAddSkill(true)
        const handleUpdateskillClose = () => setShowUpdateSkill(false)
        const handleUpdateSkillShow = () => setShowUpdateSkill(true)

        const [select_skill, set_select_skill] = useState({})
        const [select_status, set_select_status] = useState({})
        const [selectedskills, setSelectedSkills] = useState({
            skill_name: "",
            skill_status: ""
        });

        const mapStatus = {
            "In-progress": "in-progress",
            "Verified": "active",
            "Unverified": "unverified"
        };

        const [msg, setMsg] = useState('');

        useEffect(() => {
            // Get to obtain skill details
            axios.get('http://localhost:8000/api/profile/get_staff_profile/' + staff_id, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    // Set staff details
                    var staff_details = response.data.staff_details;
                    setFname(staff_details.fname);
                    setLname(staff_details.lname);
                    setDept(staff_details.dept);
                    setEmail(staff_details.email);
                    setPhone(staff_details.phone);

                    // Set staff skills if not empty
                    if (response.data.data != null) {
                        for (let i = 0; i < response.data.data.length; i++) {
                            setSkill(skill => [...skill, { skill_id: response.data.data[i].skill_id, skill_status: response.data.data[i].ss_status, skill_name: response.data.data[i].skill_name }])
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });

            // Get all skills
            axios.post('http://localhost:8000/api/profile/get_all_skills')
                .then(function (response) {
                    for (let i = 0; i < response.data.data.length; i++) {
                        setAllSkill(allSkill => [...allSkill, { value: response.data.data[i].skill_name, label: response.data.data[i].skill_name }])
                    }
                })
        }, []);

        const handleCheckSkills = (event) => {

            // check if skill is already in allSkill

            for (let i = 0; i < allSkill.length; i++) {
                for (let j = 0; j < skill.length; j++) {

                    if (allSkill[i].value == skill[j].skill_name) {
                        allSkill[i].isDisabled = true
                    }
                }
            }
        }

        const handleAddSkillDropdownChange = (event) => {
            // Manage dropdown selection
            if (event.value == 'In-progress' || event.value == 'Unverified' || event.value == 'Verified') {

                set_select_status(event.value)

                setSelectedSkills({
                    ...selectedskills,
                    "skill_status": event.value,
                })

            } else {
                set_select_skill(event.value)
                setSelectedSkills({
                    ...selectedskills,
                    "skill_name": event.value,
                })
            }
        }

        const handleAddSkillSubmit = (e) => {
            //Add skill to database
            e.preventDefault();
            let api_endpoint_url = 'http://localhost:8000/api/profile/add_skills'
            var bodyFormData = new FormData();
            bodyFormData.append('skill_name', selectedskills.skill_name)
            bodyFormData.append('skill_status', mapStatus[selectedskills.skill_status])
            bodyFormData.append('staff_id', staff_id)

            axios.post(api_endpoint_url, bodyFormData)
                .then(function (response) {
                    if (response.data.status == "success") {

                        setSkill(skill => [...skill, { skill_status: response.data.data.ss_status, skill_name: response.data.data.skill_name }])
                        setSelectedSkills([])
                        setMsg("Skill: " + selectedskills.skill_name + " has been added!");
                    }
                })
            handleAddSkillClose()

        }

        const handleUpdateSkillSubmit = (e) => {
            //Add skill to database
            e.preventDefault();
            let api_endpoint_url = 'http://localhost:8000/api/profile/update_skills'
            var bodyFormData = new FormData();
            bodyFormData.append('skill_name', selectedskills.skill_name)
            bodyFormData.append('skill_status', mapStatus[selectedskills.skill_status])
            bodyFormData.append('staff_id', staff_id)

            axios.post(api_endpoint_url, bodyFormData)
                .then(function (response) {
                    if (response.data.status == "success") {

                        setSkill(skill => skill.map(s => {
                            if (s.skill_name === selectedskills.skill_name) {
                                return { skill_status: mapStatus[selectedskills.skill_status], skill_name: selectedskills.skill_name };
                            } else {
                                return s;
                            }
                        }))
                        setSelectedSkills([])
                        setMsg("Skill: " + selectedskills.skill_name + " has been updated!");
                    }
                })
            handleUpdateskillClose()
        }

        return (
            <div>
                {navbar()}
                <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h1 className="text-white font-weight-bold">{fname}, {lname}'s Profile</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="/">Home</a><span className="mx-2 slash">/</span>
                                    <Link to="/StaffSkillList">Update Staff Skills</Link><span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>{fname}, {lname}'s Profile</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container">
                    <div className="row mb-5 mt-5">
                        {msg && (
                            <div className="alert alert-success" role="alert">{msg}</div>
                        )}
                        <div className="row mb-4">
                            <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                                <strong className="d-block text-black">Name</strong>
                                {fname}, {lname}
                            </div>
                            <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                                <strong className="d-block text-black">Department</strong>
                                {dept}
                            </div>
                            <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                                <strong className="d-block text-black">Email</strong>
                                {email}
                            </div>
                            <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                                <strong className="d-block text-black">Phone</strong>
                                {phone}
                            </div>
                            <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                                <strong className="d-block text-black mb-3">Skills</strong>
                                <ul>
                                    {skill.length === 0 ? (
                                        <li>No skill found</li>
                                    ) : (
                                        skill.map((s, index) => (
                                            <li key={index}>
                                                {s.skill_name} <Badge text="light" bg={s.skill_status == 'active' ? "primary" : "secondary"} >{s.skill_status}</Badge>
                                            </li>
                                        ))
                                    )}
                                </ul>
                                <Button variant="outline-primary" className='border-width-2 mr-2' onClick={handleAddSkillShow}>Add Skill</Button>
                                <Button variant="outline-primary" className='border-width-2' onClick={handleUpdateSkillShow}>Update Skill Status</Button>
                                {/* Add Skill Modal */}
                                <Modal show={showAddSkill} onHide={handleAddSkillClose} aria-labelledby="contained-modal-title-vcenter" centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add a new skill</Modal.Title>
                                    </Modal.Header>
                                    <Form onSubmit={handleAddSkillSubmit}>
                                        <Modal.Body>

                                            <Form.Group className="mb-3" controlId="skill_name">
                                                <Form.Label>Please select the skill you would like to add to your profile</Form.Label>
                                                <Select required={true} styles={{ control: (baseStyles, state) => ({ ...baseStyles, padding: 4.5, }), }} name="skill_name" select_skill={select_skill} placeholder="Select Skill(s)" isMulti={false} options={allSkill} onChange={handleAddSkillDropdownChange} onMenuOpen={handleCheckSkills} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="skill_status">
                                                <Form.Label>Status</Form.Label>
                                                <Select required={true} styles={{ control: (baseStyles, state) => ({ ...baseStyles, padding: 4.5, }), }} name="skill_status" select_status={select_status} placeholder="Select Status" isMulti={false} options={[{ value: "In-progress", label: "In-progress" }, { value: "Unverified", label: "Unverified" }, { value: "Verified", label: "Verified" }]} onChange={handleAddSkillDropdownChange} />
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleAddSkillClose}>
                                                Close
                                            </Button>
                                            <Button className="ml-2" variant="primary" type="submit">
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    </Form>
                                </Modal>

                                {/* Update Skill Modal */}
                                <Modal show={showUpdateSkill} onHide={handleUpdateskillClose} aria-labelledby="contained-modal-title-vcenter" centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Update Skill Status</Modal.Title>
                                    </Modal.Header>
                                    <Form onSubmit={handleUpdateSkillSubmit}>
                                        <Modal.Body>

                                            <Form.Group className="mb-3" controlId="skill_name">
                                                <Form.Label>Please select the skill you would like to update</Form.Label>
                                                <Select required={true} styles={{ control: (baseStyles, state) => ({ ...baseStyles, padding: 4.5, }), }} name="skill_name" select_skill={select_skill} placeholder="Select Skill(s)" isMulti={false} options={skill.map((s, index) => ({ value: s.skill_name, label: s.skill_name }))} onChange={handleAddSkillDropdownChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="skill_status">
                                                <Form.Label>Status</Form.Label>
                                                <Select required={true} styles={{ control: (baseStyles, state) => ({ ...baseStyles, padding: 4.5, }), }} name="skill_status" select_status={select_status} placeholder="Select Status" isMulti={false} options={[{ value: "In-progress", label: "In-progress" }, { value: "Unverified", label: "Unverified" }, { value: "Verified", label: "Verified" }]} onChange={handleAddSkillDropdownChange} />
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleUpdateskillClose}>
                                                Close
                                            </Button>
                                            <Button className="ml-2" variant="primary" type="submit">
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    </Form>
                                </Modal>

                            </div>
                            <Row><div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                                <small>Change status from &nbsp;
                                    <Badge text="light" bg="secondary">unverified</Badge>&nbsp;to&nbsp;<Badge text="light" bg="primary" >verified</Badge>&nbsp;
                                    after staff passes all checks &nbsp;
                                </small>
                            </div>
                                <div className="col-sm-12 col-md-6 mb-4 col-lg-6">
                                    <Link to={`/StaffSkillList`} className="btn btn-secondary btn-md">Return to Staff List</Link>
                                </div>
                            </Row>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default UpdateStaffSkills