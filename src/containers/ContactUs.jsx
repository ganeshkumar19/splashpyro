import { Container, Row, Col, Form, Image } from 'react-bootstrap'
import { FaEnvelope } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import '../assets/styles/contactusstyles.css'
import CR  from '../assets/images/splash.png'
import { useState } from 'react';
import { motion } from 'framer-motion';

const ContactUsBanner = () => {
  const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      feedback: ''
  });

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

  const handleSubmit = (e) => {
      e.preventDefault();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20, scale: 0 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.3, duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.5, duration: 0.5 } }
  };
  

  return (
      <Container fluid className='csBannerContainer'>
          <Row className='contactusRow'>
              <Col xs={12}>
                  <motion.div  
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible" 
                  className='ctHeaderContainer text-center'>
                      <p className='m-0 p-0 ctHeaderText'>Contact Us</p>
                  </motion.div>
              </Col>
          </Row>
          <Row className='p-3'>
              <Col className='p-0 m-0' xs={12} sm={6}>
                  <motion.div 
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible" 
                  className='iconTextContainer'>
                      <div className='contactInfoContainer d-flex align-items-center justify-content-center'>
                          <Image src={CR} className='pe-1'/>
                          <p className='m-0 ps-1'>Pyro Crackers</p>
                      </div>
                  </motion.div>
                  <div className='iconTextContainer my-4'>
                      <div className='d-flex align-items-center justify-content-center py-1'>
                          <p className='addressText m-0 p-0'>15, Sivasakthi Colony, Ganapathy, Coimbatore, Tamil Nadu</p>
                      </div>
                      <div className='d-flex align-items-center justify-content-center py-1'>
                          <FaEnvelope size={10} color='black' className='me-2'/>
                          <p className='connectmailtext m-0 p-0'>connect@splashchemicals.in</p>
                      </div>
                      <div className='d-flex align-items-center py-1'>
                          <FaPhoneAlt size={10} color='black' className='me-2'/>
                          <p className='connectnumbertext m-0 p-0'>+91 9789130541</p>
                      </div>
                  </div>
              </Col>
              <Col xs={12} sm={6}>
                  <Form onSubmit={handleSubmit}>
                      <Row>
                          <Col md={6}>
                              <Form.Group className="mb-3" controlId="formBasicName">
                                  <Form.Control
                                      type="text"
                                      placeholder="Name"
                                      className='contactNumberInput'
                                      name="name"
                                      value={formData.name}
                                      onChange={handleChange}
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                              <Form.Group className="mb-3" controlId="formBasicPhone">
                                  <Form.Control
                                      type="phone"
                                      placeholder="Phone Number"
                                      className='contactNumberInput'
                                      name="phone"
                                      value={formData.phone}
                                      onChange={handleChange}
                                  />
                              </Form.Group>
                          </Col>
                      </Row>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Control
                              type="email"
                              placeholder="Email Address"
                              className='contactNumberInput'
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                          />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicFeedback">
                          <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Tell about your feedback"
                              className='contactNumberInput'
                              name="feedback"
                              value={formData.feedback}
                              onChange={handleChange}
                          />
                      </Form.Group>

                      <div className='msgButtonContainer my-2'>
                          <button type='submit' className='msgBtn px-4 py-2'>
                              <p className='p-0 m-0'>Send Message</p>
                          </button>
                      </div>
                  </Form>
              </Col>
          </Row>
      </Container>
  );
};

export default ContactUsBanner;
