import * as React from 'react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import Fuse from 'fuse.js';
import Select from 'react-select'
import navbar from '../components/navbar.jsx'

function searchRole(){

    // const [roleList, setRoleList] = useState([])
    const roleList = [
        {role_id: 1, role_name: "Software Engineer"},
        {role_id: 2, role_name: "Test"},
    ]
    const displayMatchingRoles = []

    const location = useLocation()
    const data = location.state.data
    const roleName = data.roleName
    console.log(data.roleName)

    const getAllRoles = () =>{
        let api_url_endpoint = "http://localhost:5100/view_role_listings"

        axios.post(api_endpoint_url)
        .then(function (response) {
           
            if (response.data.data != null){
                for (let i = 0; i < response.data.data.length; i++){
                    console.log(response.data.data[i])
                    setRoleList(roleList=> [...roleList, {role_id: response.data.data[i].role_listing_id, role_name: response.data.data[i].role_name}])
                    
                }
            }
            
        })
    };

    const exactSearchRole = () =>{
        for (let i = 0; i < roleList.length; i++){
            if (roleList[i].role_name.includes(roleName)){
                displayMatchingRoles.push(roleList[i])
                console.log('success')
            }
        }
        if (displayMatchingRoles.length == 0){
            
            const fuseOptions = {
                keys: [
                    "role_name"
                ]
            }
            const fuse = new Fuse(roleList, fuseOptions)

            console.log(fuse.search(roleName))
        }
    }

    useEffect(() => {
        exactSearchRole()
    }, [])

    return(
        <div>Hi</div>
    )
}

export default searchRole