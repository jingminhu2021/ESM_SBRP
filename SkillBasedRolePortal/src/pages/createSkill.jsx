import { useState, useEffect} from "react";
import navbar from '../components/navbar.jsx';
import axios from 'axios';
import Select from 'react-select'
import { useNavigate, Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function createSkill() {
  // Check if HR is logged in
  if (sessionStorage.getItem('sys_role') != 'hr') {
    return (
        <div>
            {navbar()}
            <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">-</h1>
                            <div className="custom-breadcrumbs">
                                <a href="/">Home</a><span className="mx-2 slash">/</span>
                                <Link to="/ViewSkills">Skills</Link><span className="mx-2 slash">/</span>
                                <span className="text-white"><strong>-</strong></span>
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
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [errors, setErrors] = useState({skillname: '', skillDescription: ''});
  const [duplicate, setDuplicate] = useState('');
  const [duplicateSkillId, setDuplicateSkillID] = useState(null);
  const navigate = useNavigate();
  
  // Handle dropdown - status
  const [skillStatus, setSkillStatus] = useState('active');
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]
  const  handleDropdownChange = (selectedOption) => {
    setSkillStatus(selectedOption.value);
    console.log(`Option selected:`, skillStatus);
  };

  // Get all skills when the component mounts
  useEffect(() => {
    const getSkills = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/skill/view_skills");
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
    //Check duplicate skill name
    for (const s of allSkills){
      if (s.skill_name.toLowerCase().trim() === skillName.toLowerCase().trim()){
        setDuplicateSkillID(s.skill_id);
        setDuplicate('Skill name already existed');
        return;
      }
      else{
        setDuplicate('');
      }
    }
    // Clear error message and make sure it only execute once
    if (errors.skillName !== ''){
      setErrors({... errors, skillName: ''});
    }
  };

  const handleSkillDescriptionChange = async (event) => {
    const skillDescription = await event.target.value;
    setSkillDescription(skillDescription);
    // Clear error message and make sure it only execute once
    if (errors.skillDescription !== ''){
      setErrors({... errors, skillDescription: ''});
    }
  };

  // Check if the input fields are empty
  function checkEmpty(){
    const errors = {};
    if (skillName.trim()=== '') {
      errors.skillName = 'Skill name is required';
    }
    if (skillDescription.trim() === '') {
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

    if (checkEmpty() || duplicate !== ''){
      toast.error("Skill create fail"); // Display error toast
      return;
    }
    //set skill data
    const skillData = {
      skill_name: skillName,
      skill_description: skillDescription,
      skill_status: skillStatus,
    };
    //call api to create skill
    const response = await axios.post('http://localhost:8000/api/skill/create_skill', skillData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // Skill created successfully
      setSkillName('');
      setSkillDescription('');
      setSkillStatus('active');
      // Navigate to view skills page
      navigate('/viewSkills?created=true');

    } else {
      // Error creating skill
      console.log("Error: ", response.data);
    }
  };

  return (
    <div>
      {navbar()}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Create Skill</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a><span className="mx-2 slash">/</span>
                <a href="/viewSkills">Skills</a><span className="mx-2 slash">/</span>
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

              <form onSubmit={handleSubmit}>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="skillName">Name</label>
                    <input type="text" id="skillName"  className="form-control" value={skillName} onChange={handleSkillNameChange} />
                    {(errors.skillName || duplicate !== '') && (
                      <div className="alert alert-danger" role="alert">
                        {errors.skillName}{duplicate} &nbsp;
                        {(duplicate !== '') && (
                          <a className="text-secondary" href={`/ViewSkill/${duplicateSkillId}`}>Click here to view</a>
                        )}
                        </div>
                    )}
                    </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="skillDescription">Description</label>
                    <textarea name="message" id="skillDescription" cols="30" rows="7" className="form-control" value={skillDescription} onChange={handleSkillDescriptionChange}></textarea>
                    {(errors.skillDescription !== '') && (
                    <div className="alert alert-danger" role="alert">{errors.skillDescription}</div>
                    )}
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-6 mb-3 mb-md-0">

                    <label className="text-black" htmlFor="skillStatus">Status</label>
                    <div className="col-md-12" style={{padding: '0'}}>
                        <Select name="status" value={statusOptions.find(option => option.value === skillStatus)} options={statusOptions} onChange={handleDropdownChange} />
                    </div>

                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-auto">
                    <input type="submit" value="Create Skill" className="btn btn-primary btn-md text-white col-md-12" />
                  </div>
                  <div className="col-md-auto">
                    <Link to={'/ViewSkills'} className="btn btn-secondary btn-md col-md-12">Cancel</Link>
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
export default createSkill