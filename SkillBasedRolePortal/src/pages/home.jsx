import * as React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Select from 'react-select'
import navbar from '../components/navbar.jsx'

function home(){

    return(
        <div>
        {navbar()}
        <section className="home-section section-hero overlay bg-image" style={{backgroundImage: 'url(/images/hero_1.jpg)'}} id="home-section">
            <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-md-12">
                <div className="mb-5 text-center">
                    <h1 className="text-white font-weight-bold">The Easiest Way To Get Your Dream Role</h1>
                </div>
                </div>
            </div>
            </div>
        </section>
    </div>
      
    )
}

export default home