import React from 'react'
import { Container, Image,Row, Col } from 'react-bootstrap'
import SPLASH from '../assets/images/splash.png'
import '../assets/styles/footerstyles.css'

const FooterBanner = () => {
  return (
   <Container fluid className='footerBannerContainer'>
    <Row className='p-2 footerRow'>
        <Col xs={12} md={6} className='footerImageCol'>
        <div className='d-flex justify-content-center align-items-center gap-2'>
        <div className='footerImageContainer'>
        <Image fluid
            src={SPLASH}
            className="d-inline-block align-top me-1 footerLogo"
            alt="Logo"
          />
        </div>
        <p className='m-0 p-0'>Pyro Crackers</p>
        </div>

        </Col>
        <Col xs={12} md={6} className="footerTextInfoContainer">
        <p className='m-0 p-0'>Mail: connect@splashchemicals.in</p>
        <p className='m-0 p-0'>Phone: +91 9789130541</p>
        </Col>
        <Col xs={12} className="footerTermsContainer text-center d-flex justify-content-center align-items-center gap-2 mt-5">
        <p className='m-0 p-0'>Terms & Conditions</p>
        <p className='m-0 p-0'>Privacy Policy</p>
        </Col>
    </Row>
   </Container>
  )
}

export default FooterBanner