import { useState } from "react";
import navbar from '../components/navbar.jsx';
import axios from 'axios';

function skill() {
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillStatus, setSkillStatus] = useState('active'); 
  const [errors, setErrors] = useState({});

  const handleSkillNameChange = async (event) => {
    const skillName = await event.target.value;
    setSkillName(skillName);
    setErrors({... errors, skillName: ''});
  };

  const handleSkillDescriptionChange = async (event) => {
    const skillDescription = await event.target.value;
    setSkillDescription(skillDescription);
    setErrors({... errors, skillDescription: ''});
  };

  const handleSkillStatusChange = (event) => {
    setSkillStatus(event.target.value);
  };

  function checkErrors(){
    const errors = {};
    if (skillName === '') {
      errors.skillName = 'Skill name is required';
    }
    if (skillDescription === '') {
      errors.skillDescription = 'Skill description is required';
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return true;
    }
    return false;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (checkErrors()){
      return;
    }

    const skillData = {
      skill_name: skillName,
      skill_description: skillDescription,
      skill_status: skillStatus,
    };
    
    const response = await axios.post('http://localhost:5001/create_skill', skillData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (response.status === 200) {
      // Skill created successfully
      alert("Skill created successfully");

    } else {
      // Error creating skill
      console.log("Error: ", response.data);
    }
  };

  return (
    <div>
      {navbar()}
      <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Create Skill</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <a href="#">Skills</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Create Skill</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section" id="next-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-5 mb-lg-0 mx-auto">

              <form action="#" className="" onSubmit={handleSubmit}>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="skillName">Name</label>
                    <input type="text" id="skillName"  className="form-control" value={skillName} onChange={handleSkillNameChange} />
                    <p className="text-danger">{errors.skillName}</p>
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="skillDescription">Description</label>
                    <textarea name="message" id="skillDescription" cols="30" rows="7" className="form-control" value={skillDescription} onChange={handleSkillDescriptionChange}></textarea>
                    <p className="text-danger">{errors.skillDescription}</p>
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="skillStatus">Status</label>
                    <select id="skillStatus" className="form-control" value={skillStatus} onChange={handleSkillStatusChange}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-auto">
                    <input type="submit" value="Create" className="btn btn-primary btn-md text-white col-md-12" />
                  </div>
                </div>
              </form>

            </div>
          </div>
          </div>
        </section>
        </div>
    );
}
export default skill