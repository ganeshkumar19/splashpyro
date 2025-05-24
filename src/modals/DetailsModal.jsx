import React, { useState } from 'react'
import { Container, Modal, Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import '../assets/styles/detailsmodalstyles.css'
import { useProducts } from '../contexts/ProductContext';
import { toast } from 'react-toastify';
import axios from 'axios';


const DetailsModal = ({ show, handleClose, handleConfirm }) => {
  const {cart} = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const validateMobileNumber = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const submitCheckout = async () => {
    const { name, mobile, address } = formData;

    try {
      setSubmitLoading(true); // Start loading spinner
      const response = await axios.post('https://us-central1-splashpyro-115e8.cloudfunctions.net/api/checkout', {
        name,
        mobile,
        address,
        cart, // Send the cart items along with user details
      });

      toast.success("Checkout successful");
      const { userId } = response.data;
      handleConfirm(userId); // Call the parent function to handle post-checkout actions
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setSubmitLoading(false); // Stop loading spinner
    }
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, mobile, address } = formData;
  
    if (!name || !mobile || !address) {
      toast.warn('Please fill all the details');
      return;
    }
  
    if (!validateMobileNumber(mobile)) {
      toast.warn('Please enter a valid 10-digit mobile number');
      return;
    }
  
    // Calculate the net total of all products in the cart
    const cartNetTotal = cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
  
    // Check if the grand total is less than 1000
    if (cartNetTotal < 1000) {
      toast.warn('Please add products to the cart worth more than 1000 to checkout');
      return;
    }
  
    // Submit checkout directly if the total is greater than 1000
    submitCheckout();
  };

 

  return (
    <Modal show={show} onHide={handleClose} centered className='details-modal'>
        <Container fluid>
            <Row className='DetailsModalInfoContainer d-flex justify-content-center align-items-center'>
                    <Col xs={12} className='detailProductNameCol text-center'>
                    <p className='m-0 p-0'>Details</p>
                    </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
         <Row className='my-4'>
          <Col xs={12} className='my-1'>
                <Form.Group className="mb-3 d-flex justify-content-between align-items-center gap-4" controlId="formBasicName">
                  <p className='m-0 p-0 formLabel w-25'>Name</p>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name here"
                    name="name"
                    className='DetailsInput'
                    onChange={handleChange}
                    value={formData.name}
                  />
                </Form.Group>
          </Col>
          <Col xs={12} className='my-1'>
                <Form.Group className="mb-3 d-flex justify-content-between align-items-center gap-4" controlId="formBasicName">
                  <p className='m-0 p-0 formLabel w-25'>Mobile Number</p>
                  <Form.Control
                    type="text"
                    placeholder="Enter your WhatsApp number here"
                    name="mobile"
                    className='DetailsInput'
                    onChange={handleChange}
                    value={formData.mobile}
                  />
                </Form.Group>
          </Col>
          <Col xs={12} className='my-1'>
                <Form.Group className="mb-3 d-flex justify-content-between align-items-start gap-4" controlId="formBasicName">
                  <p className='m-0 p-0 formLabel w-25'>Address</p>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter your address here"
                    name="address"
                    className='DetailsInput'
                    onChange={handleChange}
                    value={formData.address}
                    />
                </Form.Group>
          </Col>
          </Row>
          <Row className='my-2'>
            <Col xs={12} className='d-flex justify-content-center align-items-center'>
            <div className='d-flex justify-content-center align-items-center'>
               <button type="submit" className='d-flex justify-content-center align-items-center py-2 confirmButton'>{submitLoading ? <Spinner animation="border" className="spinner-border-sm text-dark" style={{ width: '20px', height: '20px' }} /> : 'Confirm Details'}
               </button>
            </div>
            </Col>
        </Row>
        </Form>
        </Container>
    </Modal>
  )
}

export default DetailsModal