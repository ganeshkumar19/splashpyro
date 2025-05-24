import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import DetailsCard from '../components/DetailsCard';

const AboutUs = () => {

    const aboutusDetails = [
        {
            id: 1,
            heading: 'About Us',
            desc: 'Located in the vibrant city of Coimbatore, Splash Pyro Crackers is your trusted partner for celebrating Diwali with a bang! We specialise in providing a wide range of high-quality fireworks at the best prices, thanks to our direct connections with factories in the renowned fireworks hub of Sivakasi.'
        },
        {
            id: 2,
            heading: 'Exclusively for Diwali ',
            desc: 'We are dedicated to making your Diwali special. Our operations are exclusively for the Diwali season, ensuring that every festival is bright and memorable.'
        },
      ];
  return (
    <Container fluid>
        <Row>
            <Col xs={12}>
             <DetailsCard Details={aboutusDetails}/>
            </Col>
        </Row>
    </Container>
  )
}

export default AboutUs