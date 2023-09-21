import * as React from 'react';
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

function navbar(){
    
    function checkUser(){
        if(user){
            return (
                <div className="right-cta-menu text-right d-flex aligin-items-center col-6">
                    <div className="ml-auto">
                    <Link to="post-job.html" className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"><span className="mr-2 icon-add"></span>Post a Job</Link>
                    <Link to="login.html" className="m-2 btn btn-primary border-width-2 d-none d-lg-inline-block"><span className="mr-2 icon-lock_outline"></span>Log In</Link>
                    </div>
                    <Link to="#" className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3"><span className="icon-menu h3 m-0 p-0 mt-2"></span></Link>
                </div>
            )
        }
        return (
            <div>Test</div>
        )
    }



    return (
        <>
        {/* Mobile Menu */}
        <div className="site-mobile-menu site-navbar-target">
            <div className="site-mobile-menu-header">
                <div className="site-mobile-menu-close mt-3">
                    <span className="icon-close2 js-menu-toggle"></span>
                </div>
            </div>
            <div className="site-mobile-menu-body"></div>
        </div>
       
        {/* Navbar */}
        <header className="site-navbar mt-3">
            <div className="container-fluid">
                <div className="row align-items-center">
                <div className="site-logo col-6"><Link to="/">Job Board</Link></div>

                <nav className="mx-auto site-navigation">
                    <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                        <li><Link className="nav-link active" to="/">Home</Link></li>
                        <li><Link to="about.html">About</Link></li>
                        <li className="has-children">
                            <Link to="job-listings.html">Job Listings</Link>
                            <ul className="dropdown">
                                <li><Link to="job-single.html">Job Single</Link></li>
                                <li><Link to="post-job.html">Post a Job</Link></li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <Link to="services.html">Pages</Link>
                            <ul className="dropdown">
                            <li><Link to="services.html">Services</Link></li>
                            <li><Link to="service-single.html">Service Single</Link></li>
                            <li><Link to="blog-single.html">Blog Single</Link></li>
                            <li><Link to="portfolio.html">Portfolio</Link></li>
                            <li><Link to="portfolio-single.html">Portfolio Single</Link></li>
                            <li><Link to="testimonials.html">Testimonials</Link></li>
                            <li><Link to="faq.html">Frequently Ask Questions</Link></li>
                            <li><Link to="gallery.html">Gallery</Link></li>
                            </ul>
                        </li>
                        <li><Link to="blog.html">Blog</Link></li>
                        <li><Link to="contact.html">Contact</Link></li>
                        <li className="d-lg-none"><Link to="post-job.html"><span className="m-2">+</span> Post a Job</Link></li>
                        <li className="d-lg-none"><Link to="login.html">Log In</Link></li>
                    </ul>
                    
                </nav>
                    <div className="right-cta-menu text-right d-flex aligin-items-center col-6">
                        <div className="ml-auto">
                        <Link to="post-job.html" className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"><span className="mr-2 icon-add"></span>Post a Job</Link>
                        <Link to="login.html" className="m-2 btn btn-primary border-width-2 d-none d-lg-inline-block"><span className="mr-2 icon-lock_outline"></span>Log In</Link>
                        </div>
                        <Link to="#" className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3"><span className="icon-menu h3 m-0 p-0 mt-2"></span></Link>
                    </div>
                </div>
            </div>
        </header>
        </>
    )
}

export default navbar