import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row, Image } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import '../assets/styles/productmodalstyles.css';
import pb from '../assets/images/productbackground.png'


const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    const isGiftBox = Array.isArray(product.image);

    const prevBtnId = `modal-prev-btn-${product.id}`;
    const nextBtnId = `modal-next-btn-${product.id}`;
  
    return (
      <Modal show={!!product} onHide={onClose} centered className='productModal'>
        <Container fluid className='pt-3'>
            <Row className='RowCloseContainer'>
                <Col className='d-flex justify-content-end'>
                <FaTimes size={17} color='#DC143C' onClick={onClose} style={{cursor: 'pointer'}}/>
                </Col>
            </Row>
            <Row className='productModalImageContainer'>
                <Col className='my-4'>
                <div className='modalImageContainer d-flex justify-content-center align-items-center'>
                {isGiftBox ? (
                                <>
                                    {/* Custom Navigation Arrows for the modal swiper */}
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
                                        {product.image.map((img, idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="swiper-zoom-container">
                                                    <Image fluid src={img} className="productImage" />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </>
                            ) : (
                                <Image fluid src={product.image} />
                            )}
                 </div>
                </Col>
            </Row>
            <Row className='productModalInfoContainer'>
                <Col xs={12} className='productNameCol py-2'>
                 <p className='m-0 p-0'>{product.name}</p>
                 <p className='m-0 p-0'>{product.tamilName}</p>
                </Col>
                <Col xs={12} className='my-1 py-3 productDescCol'>
                 <p className='m-0 p-0'>{product.desc}</p>
                </Col>
            </Row>
        </Container>
      </Modal>
    );
  };

export default ProductModal