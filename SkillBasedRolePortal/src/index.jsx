import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/home.jsx'
import ViewRoles from './pages/viewRoles.jsx'
import ViewSingleRole from './pages/viewSingleRole.jsx'
import CreateRoleListing from './pages/createRoleListing.jsx'
import UpdateRoleListing from './pages/updateRoleListing.jsx'
import Profile from './pages/profile.jsx'
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
          <Route path="/viewRoles" element={<ViewRoles />} />
          <Route path="/viewSingleRole/:role_listing_id" element={<ViewSingleRole />} />
          <Route path="/createRoleListing" element={<CreateRoleListing />} />
          <Route path="/updateRoleListing" element={<UpdateRoleListing />} />
          <Route path="/contact" element={<Contact />} />
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