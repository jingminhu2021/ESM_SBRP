import * as React from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'
import Fuse from 'fuse.js';
import navbar from '../components/navbar.jsx'

function searchRole(){

    const [roleList, setRoleList] = useState([])
    const [roleTitleSearch, setRoleTitleSearch] = useState([])
    const [roleSkillSearch, setRoleSkillSearch] = useState([])
    const [displayMatchingRoles, setDisplayMatchingRoles] = useState([])

    const location = useLocation()
    const data = location.state.data
    const roleTitle = data.roleName
    const skill = data.skill
    const [roleSearchSuccess, setRoleSearchSuccess] = useState(null)
    const [titleResultSuccess, setTitleResultSuccess] = useState(null)
    const [skillResultSuccess, setSkillResultSuccess] = useState(null)

    const getAllRoles = () =>{
        let api_endpoint_url = "http://localhost:5003/view_role_listings"

        axios.get(api_endpoint_url)
        .then(function (response) {
           
            if (response.data.data != null){
                for (let i = 0; i < response.data.data.length; i++){
                    if (response.data.data[i].role_listing_status == "active"){
                        setRoleList(roleList=> [...roleList, {
                            role_name: response.data.data[i].role_name, 
                            role_id: response.data.data[i].role_listing_id, 
                            skill_list: response.data.data[i].skills_list,
                            role_listing_id: response.data.data[i].role_listing_id,
                            role_listing_desc: response.data.data[i].role_listing_desc,
                            role_listing_open: response.data.data[i].role_listing_open,
                            role_listing_close: response.data.data[i].role_listing_close
                        }])
                    }
                }
            }
            setRoleSearchSuccess(true)
        })
    };

    const searchTitleResult = () =>{
        setTitleResultSuccess(true)
        if (roleTitle == ""){
            return
        }
        for (let i = 0; i < roleList.length; i++){
            if (roleList[i].role_name.includes(roleTitle)){
                setRoleTitleSearch(roleTitleSearch => [...roleTitleSearch, roleList[i]])
            }
        }
        if (roleTitleSearch.length == 0 && roleTitle != ""){
            
            const fuseOptions = {
                isCaseSensitive: false,
                keys: [
                    "role_name"
                ]
            }
            const fuse = new Fuse(roleList, fuseOptions)
            for (let i = 0; i < fuse.search(roleTitle).length; i++){
                setRoleTitleSearch(roleTitleSearch => [...roleTitleSearch, roleList[i]])
            }
        }
        setTitleResultSuccess(true)
    }

    const searchSkillResult = () =>{
        loop1:
        for (let i = 0; i < roleList.length; i++){
            loop2:
            for (let j = 0; j < skill.length; j++){
                if(roleList[i].skill_list.includes(skill[j].skillName)){
                    setRoleSkillSearch(roleSkillSearch => [...roleSkillSearch, roleList[i]])
                    break loop2
                }
            }
            
        }
        setSkillResultSuccess(true)
    }

    const allMatchingRoles = () =>{
        for (let i = 0; i < roleTitleSearch.length; i++){
            setDisplayMatchingRoles(displayMatchingRoles => [...displayMatchingRoles, roleTitleSearch[i]])
        }
        for (let i = 0; i < roleSkillSearch.length; i++){
            if (!(displayMatchingRoles.includes(roleSkillSearch[i]))){
                setDisplayMatchingRoles(displayMatchingRoles => [...displayMatchingRoles, roleSkillSearch[i]])
                }
        }
        
    }

    const renderMatchingRoles = () =>{
        const array = []
        if (displayMatchingRoles.length == 0){
            return <p className="font-weight-bold" style={{ fontSize: '24px' }}>No Role Listing found!</p>
        }
        for (let i = 0; i < displayMatchingRoles.length; i++){
            array.push(
                <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5" key={displayMatchingRoles[i].role_listing_id}>
                    <Link to={`/single-role/${displayMatchingRoles[i].role_listing_id}`} className="block__16443 text-center d-block">
                    <h3>{displayMatchingRoles[i].role_id}</h3>
                    <h3>{displayMatchingRoles[i].role_name}</h3>
                    {displayMatchingRoles[i].role_listing_desc !== null ? (
                    <p>
                        <strong>Description:</strong> {displayMatchingRoles[i].role_listing_desc.length > 50
                            ? displayMatchingRoles[i].role_listing_desc.substring(0, 50) + '...' // Limit to 50 characters
                            : displayMatchingRoles[i].role_listing_desc}
                    </p>
                    ) : (
                    <p>No description available</p>
                        )}
                            <p><strong>Skill Required:</strong> {displayMatchingRoles[i].skill_list.join(", ")}</p>
                            <p><strong>Status:</strong> {displayMatchingRoles[i].role_listing_status}</p>
                            <p><strong>Open :</strong> {displayMatchingRoles[i].role_listing_open}</p>
                            <p><strong>Close :</strong> {displayMatchingRoles[i].role_listing_close}</p>
                        </Link>
                    </div>
            )
        }
        return array
    }

    useEffect(() => {
        getAllRoles()
    }, [])

    useEffect(() => {
        if (roleSearchSuccess){
            searchTitleResult()
        }
    }, [roleList])

    useEffect(() => {
        if (roleSearchSuccess){
            searchSkillResult()
        }
    }, [roleList])

    useEffect(() => {
        if (titleResultSuccess && skillResultSuccess){
            allMatchingRoles()
        }
    }, [roleTitleSearch, roleSkillSearch])

    return(
        <div>
            {navbar()}
            <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: 'url(/images/hero_1.jpg)' }} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">Role Listings</h1>
                            <div className="custom-breadcrumbs">
                            <a href="/">Home</a><span className="mx-2 slash">/</span>
                            <span className="text-white"><strong>Role Listings</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="site-section services-section bg-light block__62849 pt-4" id="next-section" style={{ padding: '0' }}>
                <div className="container">
                    <div className="row">
                        {renderMatchingRoles()}
                    </div>
                </div>
            </section>
            {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar /> */}
            

        </div>
        )
    
}

export default searchRole