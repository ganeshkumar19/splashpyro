import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import '../assets/styles/productcardstyles.css'
import { useProducts } from '../contexts/ProductContext';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';


const ProductCard = React.memo(({ item, handleCartOperation, itemQuantities, inCart, handleViewMore }) => {
    const totalPrice = useMemo(() => itemQuantities[item.id] * item.discountPrice, [itemQuantities[item.id], item.discountPrice]);
    const {handleIncrease, handleDecrease} = useProducts()

    const isGiftBox = Array.isArray(item.image);

    const prevBtnId = `prev-btn-${item.id}`;
    const nextBtnId = `next-btn-${item.id}`;

    return (
        <Col xs={6} md={4} lg={3} className="my-2 p-2 position-relative" >
            <div className='productBox '>
            <div className='productImageContainer py-4 px-2' onClick={!isGiftBox ? () => handleViewMore(item) : null}>
            {isGiftBox ? (
                        <>
                            {/* Custom Navigation Arrows with unique IDs */}
                            <div id={prevBtnId} className="custom-prev">
                                <FaArrowLeft className='faleft' />
                            </div>
                            <div id={nextBtnId} className="custom-next">
                                <FaArrowRight className='faleft' />
                            </div>
                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                }}
                                zoom={true}
                                pagination={{
                                    clickable: true,
                                }}
                                navigation={{
                                    prevEl: `#${prevBtnId}`,  // Link the custom prev button
                                    nextEl: `#${nextBtnId}`,  // Link the custom next button
                                }}
                                modules={[Zoom, Navigation, Pagination]}
                                className="mySwiper"
                            >
                                {item.image.map((img, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="swiper-zoom-container">
                                            <Image fluid src={img} className="productImage" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </>
                    ) : (
                        <Image fluid src={item.image} className="productImage" />
                    )}
            </div>
            <div className='productNamePriceContainer m-0'>
              <p className='m-0 p-0 py-1'>{item.name}</p>
              <p className='m-0 p-0 py-1'>{item.tamilName}</p>
              <p className='itemPrice m-0 p-0'>Price: <span className='orPrice'>{item.originalPrice}</span>{item.discountPrice}</p>
            </div>
            <div className='qtConatiner d-flex justify-content-between align-items-center my-2 mx-1'>
              <div className='quantityContainer d-flex align-items-center justify-content-between m-0'>
                        <p className='m-0 qtyName'>Qty</p>
                        <div className='d-flex justify-content-between align-items-center'>
                          <button onClick={() => handleDecrease(item)} className='m-0 qtyButton'>-</button>
                          <p className='m-0 qunatityNumber'>{itemQuantities[item.id]}</p>
                          <button className='m-0 qtyButton' onClick={() => handleIncrease(item, item.quantity)}>+</button>
                        </div>
              </div>
              <div className='totalContainer'>
              <p className='m-0 px-1 totalPrice'>total: {totalPrice}</p>
              </div>
            </div>
            <div className='d-flex justify-content-center align-items-center pt-4 pb-3'>
              <button onClick={() => handleCartOperation(item)} className='d-flex justify-content-center align-items-center cartButton'>
                {inCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>
            </div>
            <div className='vwContainer' onClick={() => handleViewMore(item)}>
            <p className='m-0 p-0 vwtext'>View More</p>
            </div>
         </Col>
    );
});

export default ProductCard