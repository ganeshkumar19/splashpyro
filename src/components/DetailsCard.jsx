import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import { InView } from 'react-intersection-observer';
import { delay, motion } from 'framer-motion';
import '../assets/styles/detailscardstyles.css'



const DetailsCard = ({ Details }) => {

  const MotionRow = motion(Row);

  const textBannerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3, 
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const headingVariants={
    hidden: { 
      opacity: 0, 
      y:-100
    },
    visible: {
      opacity: 1,
      y:0,
      transition: {
        delay: 1,
        duration: 1,
        ease: "easeInOut",
      }
    }
  }
  return (
   <Container fluid className='m-0 p-0'>
    {Details.map((detail, idx)=>(
    <InView threshold={0.2} triggerOnce={true} key={detail.id}>
    {({ ref, inView }) => (
    <MotionRow  
    ref={ref}
    initial='hidden' 
    animate={inView ? 'visible' : 'hidden'} 
    variants={textBannerVariants}
    className='abCardBox my-4 py-3' key={detail.id}>
        <Col xs={12}>
        <InView threshold={0.2} triggerOnce={true}>
        {({ ref, inView }) => (
        <motion.div  ref={ref}
        initial='hidden' 
        animate={inView ? 'visible' : 'hidden'} 
        variants={headingVariants} 
        className='abCardContainer'>
            <h2 className=''>{detail.heading}</h2>
            <p className='m-0 p-0'>{detail.desc}</p>
        </motion.div>
        )}
       </InView>
        </Col>
    </MotionRow>
     )}
    </InView>
    ))}

   </Container>
  )
}

export default DetailsCard