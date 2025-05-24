import React, { useState } from 'react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { Link } from 'react-scroll';
import '../assets/styles/navstyles.css'
import SPLASH from '../assets/images/splash.png'

const NavbarComponent = () => {

  const [expanded, setExpanded] = useState(false);



  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleClose = () => {
    setExpanded(false);
  };

  return (
    <Navbar expand="md" variant="dark" fixed="top" expanded={expanded} className='crackerNavbar'>
      <Container fluid>
        <Navbar.Brand href="#" className='d-flex justify-content-center align-items-center'>
          <img
            src={SPLASH}
            className="d-inline-block align-top me-1 navbarLogo"
            alt="Logo"
          />
          <p className='m-0 p-0 carckersText'>Pyro Crackers</p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle}/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center visually-hidden">
          <Link className="nav-link" to="/" spy={true} smooth={false} offset={-70} duration={900} onClick={() => handleClose()}>Home</Link>
          <Link className="nav-link" to="aboutus" spy={true} smooth={false} offset={-70} duration={900} onClick={() => handleClose()}>About</Link>
          <Link className="nav-link" to="contactus" spy={true} smooth={false} offset={-70} duration={900} onClick={() => handleClose()}>Contact</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;