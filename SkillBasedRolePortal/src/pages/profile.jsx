import { React, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import navbar from '../components/navbar.jsx'
import axios from 'axios'

function profile(){
    
    const [skill, setSkill] = useState([])
    const [allSkill, setAllSkill] = useState([])
    const [skillToAdd, setSkillToAdd] = useState("")
    
    var account_id = ""
    if(sessionStorage.getItem('status') == 'true'){
        var account_id = sessionStorage.getItem('account_id')
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
        skillList()
        allSkillList()
    }, [])

    const skillList = (account_id) =>{
        let api_endpoint_url = 'http://localhost:5001/get_skills' //Placeholder
        var bodyFormData = new FormData();

        bodyFormData.append('account_id', account_id);

        axios.post(api_endpoint_url, bodyFormData, {withCredentials: true})
        .then(function (response) {
            console.log(response)
            for (let i = 0; i < response.data.data.length; i++){
                setSkill(skill => [...skill, response.data.data[i].skill_name])
            }
    })
    }

    const allSkillList = () =>{
        let api_endpoint_url = 'http://localhost:5001/get_all_skills' //Placeholder
        var bodyFormData = new FormData();

        bodyFormData.append('account_id', account_id);
        axios.post(api_endpoint_url, bodyFormData)
        .then(function (response) {
            console.log(response)
            for (let i = 0; i < response.data.data.length; i++){
                setAllSkill(allSkill => [...allSkill, response.data.data[i].skill_name])
            }
    })
    }

    function addSkill(e){
        e.preventDefault()
        var key = skill.length
        for (let v of skill.values()){
            if (v == skillToAdd + ' - Pending Verification'){
                alert('You have already added this skill for verification!')
                return
            }
        }
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
                                    <li key={index}>{s}</li>
                                ))}
                            </ul>
                            <button className="btn btn-outline-primary border-width-2" data-toggle="modal" data-target="#skillList">Add Skill</button>

                                                        
                            <div className="modal fade" id="skillList" tabIndex="-1" role="dialog" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add a new skill</h5>
                                    <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Please select the skill you would like to add to your profile</label>
                                            <select className="form-control" onChange={(e) => setSkillToAdd(e.target.value)}>
                                                <option value="">Select Skill</option>
                                                {allSkill.map((s, index) => (
                                                    <option key={index} value={s}>{s}</option>
                                                ))}
                                            </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={addSkill}>Save changes</button>
                                </div>
                                </div>
                            </div>
                            </div>                       
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
    }
export default profile