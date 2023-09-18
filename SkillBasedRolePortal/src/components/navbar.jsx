import * as React from 'react';

function navbar(){
    return (
        <header className="site-navbar mt-3">
        <div className="container-fluid">
            <div className="row align-items-center">
            <div className="site-logo col-6"><a href="index.html">JobBoard</a></div>

            <nav className="mx-auto site-navigation">
                <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                <li><a href="index.html" className="nav-link active">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li className="has-children">
                    <a href="job-listings.html">Job Listings</a>
                    <ul className="dropdown">
                    <li><a href="job-single.html">Job Single</a></li>
                    <li><a href="post-job.html">Post a Job</a></li>
                    </ul>
                </li>
                <li className="has-children">
                    <a href="services.html">Pages</a>
                    <ul className="dropdown">
                    <li><a href="services.html">Services</a></li>
                    <li><a href="service-single.html">Service Single</a></li>
                    <li><a href="blog-single.html">Blog Single</a></li>
                    <li><a href="portfolio.html">Portfolio</a></li>
                    <li><a href="portfolio-single.html">Portfolio Single</a></li>
                    <li><a href="testimonials.html">Testimonials</a></li>
                    <li><a href="faq.html">Frequently Ask Questions</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                    </ul>
                </li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li className="d-lg-none"><a href="post-job.html"><span className="mr-2">+</span> Post a Job</a></li>
                <li className="d-lg-none"><a href="login.html">Log In</a></li>
                </ul>
            </nav>
            
            <div className="right-cta-menu text-right d-flex aligin-items-center col-6">
                <div className="ml-auto">
                <a href="post-job.html" className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"><span className="mr-2 icon-add"></span>Post a Job</a>
                <a href="login.html" className="btn btn-primary border-width-2 d-none d-lg-inline-block"><span className="mr-2 icon-lock_outline"></span>Log In</a>
                </div>
                <a href="#" className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3"><span className="icon-menu h3 m-0 p-0 mt-2"></span></a>
            </div>

            </div>
        </div>
        </header>
    )
}

export default navbar