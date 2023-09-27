import { React, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import navbar from '../components/navbar.jsx'
import axios from 'axios'

function profile(){
    
    const [skill, setSkill] = useState([])
    
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
                            <button className="btn btn-outline-primary border-width-2">Add Skill</button>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default profile