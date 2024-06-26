import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/home.jsx'
import ViewRoles from './pages/viewRoles.jsx'
import ViewRoles_management from './pages/viewRoles_management.jsx'
import ViewSingleRole from './pages/viewSingleRole.jsx'
import StaffSkillList from './pages/staffSkillList.jsx'
import UpdateStaffSkills from './pages/updateStaffSkills.jsx'
import CreateRoleListing from './pages/createRoleListing.jsx'
import UpdateRoleListing from './pages/updateRoleListing.jsx'
import ViewRolesApplicants from './pages/viewRolesApplicants.jsx'
import ViewCandidates from './pages/viewCandidates.jsx'
import ViewCandidate from './pages/viewSingleCandidate.jsx'
import Profile from './pages/profile.jsx'
import SearchRole from './pages/searchRole.jsx'
import ViewSkills from './pages/viewSkills.jsx'
import ViewSkill from './pages/viewSingleSkill.jsx'
import CreateSkill from './pages/createSkill.jsx'
import UpdateSkill from './pages/updateSkill.jsx'
import DeleteSkill from './pages/deleteSkills.jsx'
import RecoverSkill from './pages/recoverSkills.jsx'
import Logout from './components/logout.jsx'

import { BrowserRouter, Routes, Route } from "react-router-dom"

import './assets/css/custom-bs.css'
import './assets/css/jquery.fancybox.min.css'
import './assets/fonts/icomoon/style.css'
import './assets/fonts/line-icons/style.css'
import './assets/css/owl.carousel.min.css'
import './assets/css/animate.min.css'
import './assets/css/style.css'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ViewRoles" element={<ViewRoles />} />
          <Route path="/ViewRoles_management" element={<ViewRoles_management />} />
          <Route path="/ViewSingleRole/:role_listing_id" element={<ViewSingleRole />} />
          <Route path="/searchRole" element={<SearchRole />} />
          <Route path="/updateRoleListing" element={<UpdateRoleListing />} />
          <Route path="/StaffSkillList" element={<StaffSkillList />} />
          <Route path="/UpdateStaffSkills/:staff_id" element={<UpdateStaffSkills />} />
          <Route path="/CreateRoleListing" element={<CreateRoleListing />} />
          <Route path="/ViewRolesApplicants" element={<ViewRolesApplicants />} />
          <Route path="/ViewCandidates" element={<ViewCandidates />} />
          <Route path="/ViewCandidate/:staff_id" element={<ViewCandidate />} />
          <Route path="/viewSkills" element={<ViewSkills />} />  
          <Route path="/viewSkill/:skillId" element={<ViewSkill />} />
          <Route path="/createSkill" element={<CreateSkill />} />
          <Route path="/updateSkill/:skillId" element={<UpdateSkill />} />
          <Route path="/deleteSkills" element={<DeleteSkill />} />
          <Route path="/recoverSkills" element={<RecoverSkill />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )