import * as React from 'react'
import navbar from '../components/navbar.jsx'

function profile(){

    const skill = ['I', 'hate', 'programming']
    const arr = []

    function skillList(){
        for (let i = 0; i < skill.length; i++){
                arr.push(
                    <button className="btn btn-primary border-width-2 mr-2 mb-2" key={skill[i]} disabled>{skill[i]}</button>)
            }
            return (
                <div>{arr}</div>
            )
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
                <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black">Name</strong>
                    fname, lname
                </div>
                <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black">Department</strong>
                    dept
                </div>
                <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black">Email</strong>
                    email
                </div>
                <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black">Phone</strong>
                    phone
                </div>
                <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black mb-3">My Skills</strong>
                    {skillList()}
                    <button className="btn btn-outline-primary border-width-2">Add Skill</button>
                </div>
                </div> 
                </div>
            </div>
        </div>
    )
}

export default profile