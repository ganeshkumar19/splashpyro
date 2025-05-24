import React, { useEffect, useState } from 'react'
import { Container, Modal, Row, Col, Form } from 'react-bootstrap'
import '../assets/styles/thankyoumodalstyles.css'
import { TiTickOutline } from "react-icons/ti";
import Confetti from 'react-confetti';

const ThankYouModal = ({ show, handleClose, userId }) => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if(show){
            setShowConfetti(true);
            const timer = setTimeout(() => {
                    setShowConfetti(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
  }, [show]);  

  const confettiStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1060,
    opacity: showConfetti ? 1 : 0,
    transition: 'opacity 1s ease-in-out'
  };

  return (
    <>
    {showConfetti && <div style={confettiStyle}><Confetti numberOfPieces={800} width={window.innerWidth} height={window.innerHeight} run={showConfetti} tweenDuration={8} /></div>}
    <Modal show={show} onHide={handleClose} centered className='thanks-modal'>
        <Container fluid className='thankyouContainer'>
            <Row className='p-4'>
                    <Col xs={12} className='ThankyouCol text-center d-flex flex-column justify-content-center align-items-center'>
                     <div className='d-flex justify-content-center align-items-center tickContainer bg-dark my-3'>
                        <TiTickOutline size={30} color='white'/>
                     </div>
                     <div className='text-center thankYouTextContainer'>
                        <p className='m-0 p-0 refnoText'>Thank you for your order! Ref no: {userId}</p>
                        <p className='m-0 p-0 processText mt-1'>We're processing it now and will update you shortly. </p>
                        <p className='m-0 p-0 mt-3 processText'>Happy Diwali In Advance !</p>
                     </div>
                    </Col>
            </Row>
            <Row className='my-1 d-flex justify-content-center align-items-center'>
            <div className='d-flex justify-content-center align-items-center'>
               <button onClick={handleClose} className='d-flex justify-content-center align-items-center py-2 cspButton'>Continue Shopping</button>
            </div>
        </Row>
        </Container>
    </Modal>
    </>
  )
}

export default ThankYouModal