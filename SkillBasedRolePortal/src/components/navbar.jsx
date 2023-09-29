import * as React from 'react'
import login from './login.jsx'
import { Container, Nav,  Navbar, NavDropdown } from 'react-bootstrap'

function navbar(){
    var status = sessionStorage.getItem('status')
    var fname = sessionStorage.getItem('fname')
    var lname = sessionStorage.getItem('lname')
   function checkUser(){

        if(status!='true'){
            return (
                <Nav>
                    {login()}
                </Nav>
            )
        }else{
            return (
                <Nav>
                    <NavDropdown title={fname+ " " + lname} id="collasible-nav-dropdown">
                        <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="/logout">Log Out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            )
        }

   }
 
    return(
        <>
        <Navbar collapseOnSelect expand ="lg" className='bg-body-tertiary'>
            <Container>
                <Navbar.Brand href="/">Skill Based Role Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='mr-auto'>
                        <Nav.Link href="/viewRoles">Role Listings</Nav.Link>
                        <NavDropdown title="More" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/viewSingleRole">Single Role</NavDropdown.Item>
                            <NavDropdown.Item href="/createRole">Post Role</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/contact">Contact</Nav.Link>
                        <Nav.Link href="/faq">FAQ</Nav.Link>
                        <Nav.Link href="/help">Help</Nav.Link>
                        <Nav.Link href="/resources">Resources</Nav.Link>
                        <Nav.Link href="/terms">Terms</Nav.Link>
                        <Nav.Link href="/privacy">Privacy</Nav.Link>
                    </Nav>
                    <Nav className='m-auto'>
                        {checkUser()}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )

}

export default navbar