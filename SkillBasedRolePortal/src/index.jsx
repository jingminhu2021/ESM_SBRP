import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/home.jsx'
import RoleListings from './pages/role-listings.jsx'
import SingleRole from './pages/single-role.jsx'
import PostRole from './pages/post-role.jsx'
import Profile from './pages/profile.jsx'
import Contact from './pages/contact.jsx'
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
          <Route path="/role-listings" element={<RoleListings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/role-listings" element={<RoleListings />} />
          <Route path="/single-role" element={<SingleRole />} />
          <Route path="/post-role" element={<PostRole />} />
          <Route path="/contact" element={<Contact />} />
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
