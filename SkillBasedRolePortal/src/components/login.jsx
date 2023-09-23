import React from 'react';
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import axios from 'axios';

// function send_onsubmit(email, password){
//     let api_endpoint_url = 'localhost:5000/login' //Placeholder
//     var bodyFormData = new FormData();
//     bodyFormData.append('email', email);
//     bodyFormData.append('password', password);
//     axios.get(api_endpoint_url, bodyFormData)
//     .then(function (response) {
//         console.log(response);
//     })
// }


function login(size){
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    var btn_className = "d-lg-none"
    var span_className = ""
    if (size == "lg"){
        btn_className = "m-2 btn btn-primary border-width-2 d-none d-lg-inline-block"
        span_className = "mr-2 icon-lock_outline"
    }

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        // Add your authentication logic here, e.g., send data to an API
      };
    

    return (
        <>
            
            <Button className={btn_className} onClick = {handleShow}>
                <span className={span_className}></span>Log In
            </Button>
            
            <Modal show = {show} onHide = {handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            autoFocus
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password"
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name='password'
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Button variant = "secondary" onClick = {handleClose}>
                        Close
                    </Button>

                    <Button className="ml-2" variant = "primary" type="submit">
                        Login
                    </Button>
                </Form>

                </Modal.Body>
            </Modal>
        </>
    )
}
export default login