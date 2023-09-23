import React from 'react';
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
                <Form>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password"
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Group>
                </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant = "secondary" onClick = {handleClose}>
                        Close
                    </Button>
                    <Button variant = "primary" onClick = {handleClose}>
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default login