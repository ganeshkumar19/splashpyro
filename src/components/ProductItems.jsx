import React, { useState, useEffect, useRef , useMemo, useContext} from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import '../assets/styles/productinfostyles.css'
import { useProducts } from '../contexts/ProductContext';
import ProductModal from '../modals/ProductModal';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';

const ProductItems = ({products}) => {
  const {cart, setCart, removeFromCart, itemQuantities} = useProducts()
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);  
 
  const toggleOpen = () => setOpen(!open);

  const handleCartOperation = (product) => {
    const inCart = cart.some(item => item.id === product.id);
    const quantity = itemQuantities[product.id] || 0;  // Ensure there's a fallback if undefined
  
    if (quantity <= 0) {
      toast.warn("Please add quantity to the product before adding to cart.");
      return;
    }

    const netTotal = product.discountPrice * quantity;
  
    if (inCart) {
      removeFromCart(product.id);
    } else {
      // Pass the totalQuantity from the product data
      setCart([...cart, { ...product, quantity: quantity, totalQuantity: product.quantity ,  netTotal: netTotal}]);
    }
  };






const handleViewMore = (product) => {
  setSelectedProduct(product);
};

const closeModal = () => {
  setSelectedProduct(null);
};





  return (
        <Row className={`productBoxCol m-0 p-0`} onClick={toggleOpen}>
          {products.map((item) => (
                    <ProductCard
                        key={item.id}
                        item={item}
                        handleCartOperation={handleCartOperation}
                        itemQuantities={itemQuantities}
                        inCart={cart.some(cartItem => cartItem.id === item.id)}
                        handleViewMore={handleViewMore}
                    />
                ))}
       {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
      </Row>
  )
}

export default ProductItems