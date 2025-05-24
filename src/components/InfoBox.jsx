import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import '../assets/styles/infoboxstyles.css'
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';


const InfoBox = () => {

  const MotionRow = motion(Row);

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 100 // Start slightly lower
    },
    visible: {
      opacity: 1,
      y: 0, // Animate to its natural vertical position
      transition: {
        duration: 0.5,
        delay: 0.8, // A reasonable duration for a smooth fade-in
        ease: 'easeOut' // Use 'easeOut' for a smoother end to the animation
      }
    }
  };
  return (
    <Container fluid className='infoBoxContainer py-5'>
      <InView threshold={0.2} triggerOnce={true}>
      {({ ref, inView }) => (
        <MotionRow 
          variants={containerVariants} 
          ref={ref}
          initial='hidden' 
          animate={inView ? 'visible' : 'hidden'} 
          className='infoBoxRow p-4'>
            <Col xs={12} className='infoBoxCol'>
              <p>Ever been confused about what to buy with all the different varieties of crackers? Have you ever gone over budget after making your selections, or accidentally bought day crackers instead of night crackers?</p>
              <p>Here is the solution to every struggle. Just answer some questions below, and you will receive a curated list with the best of what you expect, all within your budget.</p>
            </Col>
        </MotionRow>
        )}
        </InView>
    </Container>
  )
}

export default InfoBox