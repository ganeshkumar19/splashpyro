import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import '../assets/styles/herobannerstyles.css'
import MessageModal from '../modals/MessageModal';
import { InView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const Hero = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const textBannerVariants = {
    hidden: { 
      opacity: 0, 
      y: -100, 
      scale: 0.3, 
      rotate: -20 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };


  return (
    <Container fluid className='heroBanner Text-center py-5 px-3'>
      <InView threshold={0.2} triggerOnce={true}>
      {({ ref, inView }) => (
        <motion.div 
         variants={textBannerVariants} 
         ref={ref}
         initial='hidden' 
         animate={inView ? 'visible' : 'hidden'}
         className='heroTextContainer text-center'>
            <h3>Happy diwali</h3>
            <p className='pt-3 pb-2'>Unbox Joy: The Smarter Way to Buy Crackers!</p>
            <div className='heroButtonContainer' onClick={toggleModal}>
                <button>Find Your Ideal Crackers Now!</button>
            </div>
            <MessageModal show={showModal} handleClose={toggleModal} />
        </motion.div>
        )}
        </InView>
    </Container>
  )
}

export default Hero