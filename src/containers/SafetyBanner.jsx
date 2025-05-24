import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import DetailsCard from '../components/DetailsCard';

const SafetyBanner = () => {

    const safetyDetails = [
        {
            id: 1,
            heading: 'Safety and Trust',
            desc: 'At Splash Pyro Crackers, your safety is our top priority. We ensure that every product meets stringent quality standards, so you can enjoy your celebrations without any worries.'
        },
        {
            id: 2,
            heading: 'Pre-Order Advantage',
            desc: 'To give you the best possible service, we accept orders starting 50 days before Diwali. This allows us to carefully prepare and ensure that you receive everything on time for the festivities.'
        },
        {
            id: 3,
            heading: 'Variety and Selection:',
            desc: 'From sparklers to rockets, and everything in between, we offer a complete range of fireworks to light up your Diwali night. Celebrate Diwali with Splash Pyro Crackers, where trust and quality light up the sky!'
        },
      ];
  return (
    <Container fluid>
        <Row>
            <Col xs={12}>
             <DetailsCard Details={safetyDetails}/>
            </Col>
        </Row>
    </Container>
  )
}

export default SafetyBanner