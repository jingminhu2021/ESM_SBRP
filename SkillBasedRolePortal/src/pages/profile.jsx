import { React, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import navbar from '../components/navbar.jsx'
import axios from 'axios'
import Select from 'react-select'
import {Form, Button, Modal, Badge} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function profile(){
    
    const [skill, setSkill] = useState([])
    const [allSkill, setAllSkill] = useState([])

    const [show, setShow] = useState(false);
    const handleAddSkillClose = () => setShow(false);
    const handleAddSkillShow = () => setShow(true);
    const [select_skill, set_select_skill] = useState({})
    const [select_status, set_select_status] = useState({})
    const [selectedskills, setSelectedSkills] = useState({
        skill_name: "",
        skill_status: ""
    });
    
    if(sessionStorage.getItem('status') == 'true'){
        var staff_id = sessionStorage.getItem('staff_id')
        var fname = sessionStorage.getItem('fname')
        var lname = sessionStorage.getItem('lname')
        var email = sessionStorage.getItem('email')
        var phone = sessionStorage.getItem('phone')
        var dept = sessionStorage.getItem('dept')
      
    }else{
        const navigate = useNavigate();
        useEffect(() => {
            navigate('/')
        }, [])
    }

    useEffect(() => {
        skillList(staff_id)
        allSkillList(staff_id)
    }, [])

    const skillList = (staff_id) =>{
        let api_endpoint_url = 'http://localhost:5002/get_skills' //Placeholder
        var bodyFormData = new FormData();
        
        bodyFormData.append('staff_id', staff_id);

        axios.post(api_endpoint_url, bodyFormData, {withCredentials: true})
        .then(function (response) {
           
            if (response.data.data != null){
                for (let i = 0; i < response.data.data.length; i++){
                    console.log(response.data.data[i])
                    setSkill(skill => [...skill, {skill_id: response.data.data[i].skill_id, skill_status: response.data.data[i].ss_status, skill_name: response.data.data[i].skill_name}])
                    
                }
            }
            
        })
    }
    const handleCheckSkills = (event) => {
        
        // check if skill is already in allSkill

        for (let i = 0; i < allSkill.length; i++){
            for (let j = 0; j < skill.length; j++){
                
                if (allSkill[i].value == skill[j].skill_name){
                    allSkill[i].isDisabled = true
                }
            }
        }
    }

    const handleAddSkillDropdownChange = (event) => {
        // Manage dropdown selection
        if(event.value == 'In-progress' || event.value == 'Completed'){
            
            set_select_status(event.value)
            
            setSelectedSkills({
                ...selectedskills,
                "skill_status": event.value,
            })
            
        }else{
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
        let api_endpoint_url = 'http://localhost:5002/add_skills' //Placeholder
        var bodyFormData = new FormData();
        bodyFormData.append('skill_name', selectedskills.skill_name)
        bodyFormData.append('skill_status', selectedskills.skill_status=="In-progress"?"in-progress":"unverified")
        bodyFormData.append('staff_id', staff_id)

        axios.post(api_endpoint_url, bodyFormData)
        .then(function (response) {
            console.log(response)
            if (response.data.status == "success"){
                
                setSkill(skill => [...skill, {skill_status: response.data.data.ss_status, skill_name: response.data.data.skill_name}])
                setSelectedSkills([])
            }
        })
        handleAddSkillClose()

    }

    const allSkillList = (staff_id) =>{
        // Retrieve all Skills
        let api_endpoint_url = 'http://localhost:5002/get_all_skills' //Placeholder
        var bodyFormData = new FormData();
        console.log("--getting full skill list--")
        bodyFormData.append('staff_id', staff_id);
        axios.post(api_endpoint_url, bodyFormData)
        .then(function (response) {
            console.log(response)
            for (let i = 0; i < response.data.data.length; i++){
                setAllSkill(allSkill => [...allSkill, {value: response.data.data[i].skill_name , label: response.data.data[i].skill_name}])
            }
        })
    }

    return (
        <div>
            {navbar()}
       
            <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: 'url(/images/hero_1.jpg)'}} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="text-white">My Profile</h1>                            
                        </div>
                    </div>
                </div>
            </section>   

            <div className="container">
                <div className="row mb-5 mt-5">   
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
                            <strong className="d-block text-black mb-3">My Skills</strong>
                            <ul>
                                {skill.map((s, index) => (
                                    
                                    <li key={index}>{s.skill_name} <Badge text="light" bg={s.skill_status == 'active'?"primary":"secondary"} >{s.skill_status}</Badge></li>
                                  
                                ))}
                                
                            </ul>
                            <Button variant="outline-primary" className='border-width-2 mr-2' onClick={handleAddSkillShow}>Add Skill</Button>
                            <Button variant="outline-primary" className='border-width-2'>Update Skill Status</Button>

                            <Modal show = {show} onHide = {handleAddSkillClose} aria-labelledby="contained-modal-title-vcenter" centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Add a new skill</Modal.Title>
                            </Modal.Header>
                                <Form onSubmit={handleAddSkillSubmit}>
                                    <Modal.Body>

                                        <Form.Group className="mb-3" controlId="skill_name">
                                            <Form.Label>Please select the skill you would like to add to your profile</Form.Label> 
                                            <Select required={true} styles={{ control: (baseStyles, state) => ({...baseStyles, padding: 4.5,}),}} name="skill_name" select_skill={select_skill} placeholder="Select Skill(s)" isMulti={false} options={allSkill} onChange={handleAddSkillDropdownChange} onMenuOpen={handleCheckSkills}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="skill_status">
                                            <Form.Label>Status</Form.Label>
                                            <Select required={true} styles={{ control: (baseStyles, state) => ({...baseStyles, padding: 4.5,}),}} name="skill_status" select_status={select_status} placeholder="Select Status" isMulti={false} options={[{value: "Completed", label: "Completed"}, {value: "In-progress", label: "In-progress"}]} onChange={handleAddSkillDropdownChange}/>
                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant = "secondary" onClick = {handleAddSkillClose}>
                                            Close
                                        </Button>
                                        <Button className="ml-2" variant = "primary" type="submit">
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal>                    
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
    }
export default profile