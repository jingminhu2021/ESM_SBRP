import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

function logout(){
    sessionStorage.clear()
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/')
    }, [])

    return (
        <>
          
        </>
    )
}
export default logout