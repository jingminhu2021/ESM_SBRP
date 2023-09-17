import './App.css'
import { Form, FormGroup } from 'react-bootstrap'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'

function SliderArea(){
  return (
    <>
        {/* slider Area Start */}
        <div className="slider-area ">
            {/* Mobile Menu */}
            <div className="slider-active">
                <div className="single-slider slider-height d-flex align-items-center" data-background="/src/assets/img/hero/h1_hero.jpg">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 col-lg-9 col-md-10">
                                <div className="hero__caption">
                                    <h1>Find the most exciting startup jobs</h1>
                                </div>
                            </div>
                        </div>
                        {/* Search Box */}
                        <div className="row">
                            <div className="col-xl-8">
                                {/* form */}
                                <Form className='search-box'>
                                  <FormGroup className='input-form'>
                                    <Form.Control type="text" placeholder="Job Title or keyword"/>
                                  </FormGroup>
                                  <FormGroup className='select-form'>
                                    <Form.Control as='select'>
                                      <option value="">Location BD</option>
                                      <option value="">Location PK</option>
                                      <option value="">Location US</option>
                                      <option value="">Location UK</option>
                                    </Form.Control>
                                  </FormGroup>
                                  <FormGroup className='search-form'>
                                    <a href="#">Find job</a>
                                  </FormGroup>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </>
  )
}

function OurServices(){
  return(
    <>
            {/* Our Services Start */}
        <div className="our-services section-pad-t30">
            <div className="container">
                {/*  Section Title  */}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-tittle text-center">
                            <span>FEATURED TOURS Packages</span>
                            <h2>Browse Top Categories </h2>
                        </div>
                    </div>
                </div>
                <div className="row d-flex justify-contnet-center">
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="single-services text-center mb-30">
                            <div className="services-ion">
                                <span className="flaticon-tour"></span>
                            </div>
                            <div className="services-cap">
                               <h5><a href="job_listing.html">Design & Creative</a></h5>
                                <span>(653)</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="single-services text-center mb-30">
                            <div className="services-ion">
                                <span className="flaticon-cms"></span>
                            </div>
                            <div className="services-cap">
                               <h5><a href="job_listing.html">Design & Development</a></h5>
                                <span>(658)</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="single-services text-center mb-30">
                            <div className="services-ion">
                                <span className="flaticon-report"></span>
                            </div>
                            <div className="services-cap">
                               <h5><a href="job_listing.html">Sales & Marketing</a></h5>
                                <span>(658)</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="single-services text-center mb-30">
                            <div className="services-ion">
                                <span className="flaticon-app"></span>
                            </div>
                            <div className="services-cap">
                               <h5><a href="job_listing.html">Mobile Application</a></h5>
                                <span>(658)</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="single-services text-center mb-30">
                            <div className="services-ion">
                                <span className="flaticon-helmet"></span>
                            </div>
                            <div className="services-cap">
                               <h5><a href="job_listing.html">Construction</a></h5>
                                <span>(658)</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="single-services text-center mb-30">
                            <div className="services-ion">
                                <span className="flaticon-high-tech"></span>
                            </div>
                            <div className="services-cap">
                               <h5><a href="job_listing.html">Information Technology</a></h5>
                                <span>(658)</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="single-services text-center mb-30">
                            <div className="services-ion">
                                <span className="flaticon-real-estate"></span>
                            </div>
                            <div className="services-cap">
                               <h5><a href="job_listing.html">Real Estate</a></h5>
                                <span>(658)</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="single-services text-center mb-30">
                            <div className="services-ion">
                                <span className="flaticon-content"></span>
                            </div>
                            <div className="services-cap">
                               <h5><a href="job_listing.html">Content Writer</a></h5>
                                <span>(658)</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  More Btn  */}
                {/*  Section Button  */}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="browse-btn2 text-center mt-50">
                            <a href="job_listing.html" className="border-btn2">Browse All Sectors</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Our Services End  */}
    </>
  )
}

function App() {
  

  return (
    <>
      {Header()}
      <main>
        {SliderArea()}
        {OurServices()}
        {/* Online CV Area Start */}
         <div className="online-cv cv-bg section-overly pt-90 pb-120"  data-background="/src/assets/img/gallery/cv_bg.jpg">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <div className="cv-caption text-center">
                            <p className="pera1">FEATURED TOURS Packages</p>
                            <p className="pera2"> Make a Difference with Your Online Resume!</p>
                            <a href="#" className="border-btn2 border-btn4">Upload your cv</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Online CV Area End */}
        {/* Featured_job_start */}
        <section className="featured-job-area feature-padding">
            <div className="container">
                {/* Section Title */}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-tittle text-center">
                            <span>Recent Job</span>
                            <h2>Featured Jobs</h2>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        {/* single-job-content */}
                        <div className="single-job-items mb-30">
                            <div className="job-items">
                                <div className="company-img">
                                    <a href="job_details.html"><img src="/src/assets/img/icon/job-list1.png" alt=""/></a>
                                </div>
                                <div className="job-tittle">
                                    <a href="job_details.html"><h4>Digital Marketer</h4></a>
                                    <ul>
                                        <li>Creative Agency</li>
                                        <li><i className="fas fa-map-marker-alt"></i>Athens, Greece</li>
                                        <li>$3500 - $4000</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="items-link f-right">
                                <a href="job_details.html">Full Time</a>
                                <span>7 hours ago</span>
                            </div>
                        </div>
                        {/* single-job-content */}
                        <div className="single-job-items mb-30">
                            <div className="job-items">
                                <div className="company-img">
                                    <a href="job_details.html"><img src="/src/assets/img/icon/job-list2.png" alt=""/></a>
                                </div>
                                <div className="job-tittle">
                                    <a href="job_details.html"><h4>Digital Marketer</h4></a>
                                    <ul>
                                        <li>Creative Agency</li>
                                        <li><i className="fas fa-map-marker-alt"></i>Athens, Greece</li>
                                        <li>$3500 - $4000</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="items-link f-right">
                                <a href="job_details.html">Full Time</a>
                                <span>7 hours ago</span>
                            </div>
                        </div>
                         {/* single-job-content */}
                        <div className="single-job-items mb-30">
                            <div className="job-items">
                                <div className="company-img">
                                    <a href="job_details.html"><img src="/src/assets/img/icon/job-list3.png" alt=""/></a>
                                </div>
                                <div className="job-tittle">
                                    <a href="job_details.html"><h4>Digital Marketer</h4></a>
                                    <ul>
                                        <li>Creative Agency</li>
                                        <li><i className="fas fa-map-marker-alt"></i>Athens, Greece</li>
                                        <li>$3500 - $4000</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="items-link f-right">
                                <a href="job_details.html">Full Time</a>
                                <span>7 hours ago</span>
                            </div>
                        </div>
                         {/* single-job-content */}
                        <div className="single-job-items mb-30">
                            <div className="job-items">
                                <div className="company-img">
                                    <a href="job_details.html"><img src="/src/assets/img/icon/job-list4.png" alt=""/></a>
                                </div>
                                <div className="job-tittle">
                                    <a href="job_details.html"><h4>Digital Marketer</h4></a>
                                    <ul>
                                        <li>Creative Agency</li>
                                        <li><i className="fas fa-map-marker-alt"></i>Athens, Greece</li>
                                        <li>$3500 - $4000</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="items-link f-right">
                                <a href="job_details.html">Full Time</a>
                                <span>7 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Featured_job_end  */}
        {/*  How  Apply Process Start */}
        <div className="apply-process-area apply-bg pt-150 pb-150" data-background={"/src/assets/img/gallery/how-applybg.png"}>
            <div className="container">
                {/* Section Title  */}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-tittle white-text text-center">
                            <span>Apply process</span>
                            <h2> How it works</h2>
                        </div>
                    </div>
                </div>
                {/*  Apply Process Caption */}
                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="single-process text-center mb-30">
                            <div className="process-ion">
                                <span className="flaticon-search"></span>
                            </div>
                            <div className="process-cap">
                               <h5>1. Search a job</h5>
                               <p>Sorem spsum dolor sit amsectetur adipisclit, seddo eiusmod tempor incididunt ut laborea.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="single-process text-center mb-30">
                            <div className="process-ion">
                                <span className="flaticon-curriculum-vitae"></span>
                            </div>
                            <div className="process-cap">
                               <h5>2. Apply for job</h5>
                               <p>Sorem spsum dolor sit amsectetur adipisclit, seddo eiusmod tempor incididunt ut laborea.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="single-process text-center mb-30">
                            <div className="process-ion">
                                <span className="flaticon-tour"></span>
                            </div>
                            <div className="process-cap">
                               <h5>3. Get your job</h5>
                               <p>Sorem spsum dolor sit amsectetur adipisclit, seddo eiusmod tempor incididunt ut laborea.</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
        {/* How  Apply Process End */}


      </main>
      {Footer()}
    </>
  )
}

export default App
