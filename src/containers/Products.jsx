import React, { useState, useRef , useEffect, useContext} from 'react'
import { Col, Container, Image, Row, Dropdown, Spinner } from 'react-bootstrap'
import '../assets/styles/productstyles.css'
import CART from '../assets/images/shopping-cart.png'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useProducts } from '../contexts/ProductContext';
import ProductItems from '../components/ProductItems';
import CartModal from '../modals/CartModal';
import DetailsModal from '../modals/DetailsModal';
import ThankYouModal from '../modals/ThankYouModal';
import CategoryTab from '../components/CategoryTab';

const Products = () => {
    const { categories, categoryItems, loadCategoryItems, netTotal, grandTotal, cart, savings, loading, itemLoading } = useProducts();
    const [openCategories, setOpenCategories] = useState(new Set());
    const categoryRefs = useRef(new Map());
    const [showCartModal, setShowCartModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [userId, setUserId] = useState(null);
    
    const toggleCartModal = () => setShowCartModal(!showCartModal);
    const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);
    const toggleThanksModal = () => setShowThankYouModal(!showThankYouModal);

    const handleProceed = () => {
      toggleCartModal();  // Close the Cart Modal
      toggleDetailsModal();  // Open the Details Modal
   };

   const handleConfirm = (userId) => {
    setUserId(userId);
    toggleDetailsModal();
    setTimeout(() => {
      toggleThanksModal();
    }, 100);
  };


  const toggleCategory = async (categoryId) => {

    setOpenCategories(prev => {
        const updated = new Set(prev);
        updated.has(categoryId) ? updated.delete(categoryId) : updated.add(categoryId);
        return updated;
    });

    if (!categoryItems[categoryId]) {
        await loadCategoryItems(categoryId); // Fetch category items when first opened
    }

    setTimeout(() => {
        const ref = categoryRefs.current.get(categoryId);
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.error("Ref not found for category ID:", categoryId);
        }
    }, 100);
};

useEffect(() => {
    // Create a ref for each category dynamically
    categories.forEach(category => {
        if (!categoryRefs.current.has(category.categoryId)) {
            categoryRefs.current.set(category.categoryId, React.createRef());
        }
    });
}, [categories]);

if (loading) {
  return <div className="d-flex justify-content-center align-items-center">
    <Spinner animation="border" className="spinner-border-lg text-dark" style={{ width: '30px', height: '30px' }} />
  </div>;  // Display loader while fetching
}

  
  return (
    <Container fluid className='productsContainer'>
        <h3 className='text-center mb-4'>Products</h3>
        <Row className='productInfoRow py-4'>
            <Col xs={6}>
            <Row>
            <div className='d-flex flex-column flex-sm-row'>
             <p className='m-0 p-0 pe-4 infoText'>Net Total: {netTotal}</p>
             <p className='m-0 p-0 infoText'>You Saved : {savings} </p>
             </div>
            </Row>
            </Col>
            <Col xs={6} md={6}>
             <div className='d-flex justify-content-end'>
             <p className='m-0 p-0 pe-3 infoText'>GrandTotal: {grandTotal}</p>
             <div className='cartBtnConatiner position-relative' onClick={toggleCartModal}>
                <Image fluid src={CART} className='cartImage'/>
             </div>
             <div className='position-absolute cartNumber'>{cart.length}</div>
             </div>
            </Col>
            <Col xs={12} className='p-0 mt-3'>
              <CategoryTab categories={categories} toggleCategory={toggleCategory} activeCategories={openCategories} itemLoading={itemLoading}/>
            </Col>
        </Row>
        {categories.map((category) => (
        <Row key={category.categoryId} className="mt-3 mb-3">
        <Col xs={12} className='m-0 p-0'>
        <div ref={categoryRefs.current.get(category.categoryId)} className={`categoryNameContainer d-flex align-items-center justify-content-between ${!itemLoading[category.categoryId] && openCategories.has(category.categoryId) ? '' : 'category-open'}`} onClick={() => toggleCategory(category.categoryId)}>
              <p className='m-0 p-0'>{category.categoryName}</p>
              <div className='iconContainer'>
                {itemLoading[category.categoryId] ? (
                  <Spinner animation="border" className="spinner-border-sm text-danger" style={{ width: '20px', height: '20px' }} />
                ) : (
                  openCategories.has(category.categoryId) ? <IoIosArrowUp size={15} className='arrowProducticon' /> : <IoIosArrowDown size={20} className='arrowProducticon' />
                )}
              </div>
            </div>
         </Col>
         {openCategories.has(category.categoryId) && categoryItems[category.categoryId] && (
                        <ProductItems products={categoryItems[category.categoryId]} />
                    )}
        </Row>
        ))}
        <Row>
      <Col xs={12}>
      <div className='d-flex justify-content-center align-items-center py-3 py-md-5'>
        <button className='d-flex justify-content-center align-items-center buyNowButton' onClick={toggleCartModal}>Buy Now</button>
      </div>
      </Col>
        <CartModal show={showCartModal} handleClose={toggleCartModal} handleProceed={handleProceed}/>
        <DetailsModal show={showDetailsModal} handleClose={toggleDetailsModal} handleConfirm={handleConfirm} />
        <ThankYouModal show={showThankYouModal} handleClose={toggleThanksModal} userId={userId}/>  
    </Row>
    </Container>
  )
}

export default Products


