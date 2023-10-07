import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import navbar from '../components/navbar.jsx';
import axios from 'axios';

function skill() {
  // Check if HR is logged in
  if (sessionStorage.getItem('sys_role') != 'hr') {
    return (
      <div>
        {navbar()}
        <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Update Skill</h1>
                <div className="custom-breadcrumbs">
                  <a href="/">Home</a><span className="mx-2 slash">/</span>
                  <Link to="/ViewSkills">Skills</Link><span className="mx-2 slash">/</span>
                  <Link to="/ViewSkill/-">-</Link><span className="mx-2 slash">/</span>
                  <span className="text-white"><strong>Update Skill</strong></span>
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
    // to get from prev page
    const navigate = useNavigate();
    const { skillId } = useParams();
    const [allSkills, setAllSkills] = useState([]);
    const [skillNameTitle, setSkillNameTitle] = useState(''); // store skill name for breadcrumb
    const [skillName, setSkillName] = useState('');
    const [skillDescription, setSkillDescription] = useState('');
    const [errors, setErrors] = useState({ skillname: '', skillDescription: '' });
    const [duplicate, setDuplicate] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // error message if response is not 200

    useEffect(() => {
      // Get to obtain skill details
      axios.get('http://localhost:5001/view_skill/' + skillId, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setSkillNameTitle(response.data.data.skill_name);
          setSkillName(response.data.data.skill_name);
          setSkillDescription(response.data.data.skill_description);
        })
        .catch(error => {
          console.error('Error fetching skill:', error);
        });

      // Get to check on duplicate skill name
      const getSkills = async () => {
        try {
          const response = await axios.get("http://localhost:5001/view_skills");
          if (response.status === 200) {
            setAllSkills(response.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getSkills();
    }, []);

    const handleSkillNameChange = async (event) => {
      const skillName = await event.target.value;
      setSkillName(skillName);
      //Check duplicate skill name + ignore if current name remains unchanged
      for (const s of allSkills) {
        if (s.skill_name.toLowerCase().trim() === skillName.toLowerCase().trim() && s.skill_name != skillNameTitle) {
          setDuplicate('Skill name already exists');
          return;
        }
        else {
          setDuplicate('');
        }
      }
      // Clear error message and make sure it only execute once
      if (errors.skillName !== '') {
        setErrors({ ...errors, skillName: '' });
      }
    };

    const handleSkillDescriptionChange = async (event) => {
      const skillDescription = await event.target.value;
      setSkillDescription(skillDescription);
      // Clear error message and make sure it only execute once
      if (errors.skillDescription !== '') {
        setErrors({ ...errors, skillDescription: '' });
      }
    };


    // Check if the input fields are empty
    function checkEmpty() {
      const errors = {};
      if (skillName.trim() === '') {
        errors.skillName = 'Skill name is required';
      }
      
      if (skillDescription === null) {
        errors.skillDescription = 'Skill description is required';
      }
      else if (skillDescription.trim() === '') {
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

      if (checkEmpty() || duplicate !== '') return;

      const skillData = {
        skill_id: skillId,
        skill_name: skillName,
        skill_description: skillDescription,
      };

      const response = await axios.put('http://localhost:5001/update_skill', skillData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Redirect back to view skills page with success message
        navigate(`/ViewSkill/${skillId}`, { state: { message: 'Skill updated successfully!' } });

      } else {
        // Error creating skill
        setErrorMessage('An error occurred while updating the skill. Please try again.');
      }

    };

    return (
      <div>
        {navbar()}
        <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Update Skill</h1>
                <div className="custom-breadcrumbs">
                  <a href="/">Home</a><span className="mx-2 slash">/</span>
                  <Link to="/ViewSkills">Skills</Link><span className="mx-2 slash">/</span>
                  <Link to={`/ViewSkill/${skillId}`}>{skillNameTitle}</Link><span className="mx-2 slash">/</span>
                  <span className="text-white"><strong>Update Skill</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section" id="next-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-5 mb-lg-0 mx-auto">
                {(errorMessage) && (
                  <div className="alert alert-danger" role="alert">{errorMessage}</div>
                )}
                <form action="#" className="" onSubmit={handleSubmit}>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <label className="text-black" htmlFor="skillName">Name</label>
                      <input type="text" id="skillName" className="form-control" value={skillName} onChange={handleSkillNameChange} />
                      {(errors.skillName || duplicate !== '') && (
                        <div className="alert alert-danger" role="alert">{errors.skillName}{duplicate}</div>
                      )}
                    </div>
                  </div>

                  <div className="row form-group">
                    <div className="col-md-12">
                      <label className="text-black" htmlFor="skillDescription">Description</label>
                      {skillDescription !== null ? (
                        <textarea name="message" id="skillDescription" cols="30" rows="7" className="form-control" value={skillDescription} onChange={handleSkillDescriptionChange}></textarea>
                      ) : (
                        <textarea name="message" id="skillDescription" cols="30" rows="7" className="form-control" value="" onChange={handleSkillDescriptionChange}></textarea>
                      )}
                      {(errors.skillDescription) && (
                        <div className="alert alert-danger" role="alert">{errors.skillDescription}</div>
                      )}
                    </div>
                  </div>

                  <div className="row form-group">
                    <div className="col-md-auto">
                      <input type="submit" value="Update" className="btn btn-info btn-md text-white btn-md mt-4" /> &nbsp;
                      <Link to={`/ViewSkill/${skillId}`} className="btn btn-danger btn-md mt-4">Cancel</Link>
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
}
export default skill