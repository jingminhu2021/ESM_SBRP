import * as React from 'react'
import login from './login.jsx'
import { Container, Nav,  Navbar, NavDropdown } from 'react-bootstrap'

function navbar(){
    var status = sessionStorage.getItem('status')
    var fname = sessionStorage.getItem('fname')
    var lname = sessionStorage.getItem('lname')
    function checkUser() {
        if (status !== 'true') {
          return (
            <Nav>
              {login()}
            </Nav>
          );
        } else {
          return (
            <Nav>
              <NavDropdown title={`${fname} ${lname}`} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/logout">Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          );
        }
      }

    // Display if Staff is logged in
    function checkStaff() {
      if (sessionStorage.getItem('sys_role') === 'staff') {
        return (
          <>
            <Nav.Link href="/viewRoles">Role Listings</Nav.Link>
          </>
        );
      }
    }

    // Display if HR is logged in
    function checkHr() {
      if (sessionStorage.getItem('sys_role') === 'hr') {
        return (
          <>
            <Nav.Link href="/viewRoles">Role Listings</Nav.Link>
            <Nav>
              <NavDropdown title="Role Management" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/viewRoles_management">View All Roles</NavDropdown.Item>
                <NavDropdown.Item href="/createRoleListing">Create New Role</NavDropdown.Item>
                <NavDropdown.Item href="/updateRoleListing">Update Existing Role</NavDropdown.Item>
                <NavDropdown.Item href="/viewRolesApplicants">View Role Applicants</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <NavDropdown title="Staff Management" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/viewCandidates">Search for Candidates</NavDropdown.Item>
                <NavDropdown.Item href="/staffSkillList">Update Staff Skills</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav.Link href="/viewSkills">Skills Directory</Nav.Link>
          </>
        );
      }
    }

    // Display if Manager is logged in
    function checkManager() {
      if (sessionStorage.getItem('sys_role') === 'manager') {
        return (
          <>
            <Nav.Link href="/viewRoles">Role Listings</Nav.Link>
            <NavDropdown title="Role Management" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/viewRoles_management">View All Roles</NavDropdown.Item>
              <NavDropdown.Item href="/viewRolesApplicants">View Role Applicants</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/viewCandidates">Search for Candidates</Nav.Link>
          </>
        );
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
                        {checkStaff()}
                        {checkHr()}
                        {checkManager()}
                    </Nav>
                    <Nav>
                        {checkUser()}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )

}

export default navbar