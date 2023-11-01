import React from 'react';
import { useState } from "react";
import {Form, Button, Modal, Alert} from 'react-bootstrap'
import axios from 'axios';

function login(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    var btn_className = "m-2 btn btn-primary"
    var span_className = "mr-2 icon-lock_outline"
    const [incorrect, setIncorrect] = useState("d-none")
    const [variant, setVariant] = useState("danger")

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
        send_onsubmit(formData.email, formData.password)
      };
    
    const send_onsubmit = (email, password) => {
        let api_endpoint_url = 'http://localhost:8000/api/login/login'
        var bodyFormData = new FormData();
        bodyFormData.append('email', email);
        bodyFormData.append('password', password);
        axios.post(api_endpoint_url, bodyFormData, {withCredentials: true})
        .then(function (response) {
            if (response.data.data == null){
                console.log(response)   
                setIncorrect("d-block")
                setVariant("danger")
            }else{
                console.log(response)
                sessionStorage.setItem('status', true)
                sessionStorage.setItem('staff_id', response.data.data.staff_id)
                sessionStorage.setItem('email', response.data.data.email)
                sessionStorage.setItem('sys_role', response.data.data.sys_role)
                sessionStorage.setItem('fname', response.data.data.fname)
                sessionStorage.setItem('lname', response.data.data.lname)
                sessionStorage.setItem('phone', response.data.data.phone)
                sessionStorage.setItem('biz_address', response.data.data.biz_address)
                sessionStorage.setItem('dept', response.data.data.dept)
                window.location.reload(false)
            }
        })
      }

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
                    <Alert variant={variant} className={incorrect}>Incorrect email or password</Alert>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            autoFocus
                            value={formData.email}
                            onChange={handleInputChange}
                            autoComplete="off"
                            dataTestid = "email"
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
                            autoComplete="off"
                            dataTestid = "password"
                        />
                    </Form.Group>

                    <Button variant = "secondary" onClick = {handleClose}>
                        Close
                    </Button>

                    <Button className="ml-2" variant = "primary" type="submit" dataTestid="login">
                        Login
                    </Button>
                </Form>

                </Modal.Body>
            </Modal>
        </>
    )
}
export default login