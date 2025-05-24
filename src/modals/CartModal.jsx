import React, { useContext, useEffect, useMemo } from 'react'
import { Container, Modal, Row, Col, Image } from 'react-bootstrap'
import '../assets/styles/cartmodalstyles.css'
import { useProducts } from '../contexts/ProductContext'


const CartModal = ({ show, handleClose, handleProceed }) => {

  const {cart, handleIncrease, handleDecrease} = useProducts();

  const calculateTotal = (price, quantity) => {
    return price * quantity;
  };

  const netTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.discountPrice * item.quantity, 0);
  }, [cart]);

  const shippingCharge = netTotal < 3000 ? 100 : 0;

   const grandTotal = useMemo(() => {
    return netTotal + shippingCharge;
  }, [netTotal, shippingCharge]);




  return (
    <Modal show={show} onHide={handleClose} centered className='cart-modal'>
        <Container fluid>
        <Row className='cartModalInfoContainer d-flex justify-content-center align-items-center'>
                <Col xs={12} className='cartProductNameCol text-center'>
                 <p className='m-0 p-0'>Cart</p>
                </Col>
        </Row>
        {cart.length > 0 ? (
          cart.map((item, index) => (
           <Row key={index} className='cartProductContainer py-3 justify-content-center align-items-center'>
            <Col xs={2} className='p-0'>
              <div className='cartProductImageContainer d-flex justify-content-center align-items-center'>
                <Image fluid src={item.image} className='cartproductImage'/>
              </div>
            </Col>
            <Col xs={6}>
              <div className='cartProductPriceContainer'>
              <div className='d-flex justify-content-start align-items-start'>
              <p className='cartitemName m-0 p-0 mb-1'>{item.name}</p>
              </div>
              <div className='quantityContainer d-flex align-items-center justify-content-between m-0'>
                        <p className='m-0 qtyName'>Qty</p>
                        <div className='d-flex justify-content-between align-items-center'>
                          <button className='m-0 qtyButton' onClick={() => handleDecrease(item)}>-</button>
                          <p className='m-0 qunatityNumber'>{item.quantity}</p>
                          <button className='m-0 qtyButton'onClick={() => handleIncrease(item, item.totalQuantity)}>+</button>
                        </div>
              </div>
              </div>
            </Col>
            <Col xs={4} className='d-flex flex-column justify-content-end align-items-end p-0 px-2'>
               <p className='cartitemPrice m-0 p-0 mb-1'>Price: <span className='orPrice'>{item.originalPrice}</span>{item.discountPrice}</p>
               <p className='m-0 p-0 cartProductTotal'>Total: {calculateTotal(item.discountPrice, item.quantity)}</p>
            </Col>
        </Row>
         ))
        ) : (
            <Row className='py-4'>
              <Col xs={12} className='text-center'>
                <p className='npcText m- p-0'>No products added to the cart.</p>
              </Col>
            </Row>
        )}
        {cart.length > 0 && (
        <Row className='py-4'>
            <div className='d-flex flex-column justify-content-end align-items-end cartTotalContainer'>
                <p className='m-0 p-0'>Net Total: {netTotal}</p>
                <p className='m-0 p-0'>Shipping Charges: {shippingCharge}</p>
            </div>
            <div className='d-flex flex-column justify-content-end align-items-end py-2 grandTotal my-4'>
                <p className='m-0 p-0'>Grand Total: {grandTotal}</p>
            </div>
        </Row>
        )}
        {cart.length > 0 && (
        <Row className='my-2 d-flex justify-content-center align-items-center'>
            <div className='d-flex justify-content-center align-items-center'>
               <button onClick={handleProceed} className='d-flex justify-content-center align-items-center py-2 proceedButton'>Proceed</button>
            </div>
        </Row>
        )}
        </Container>
    </Modal>
  )
}

export default CartModal