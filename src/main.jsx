import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ProductsProvider } from './contexts/ProductContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';

createRoot(document.getElementById('root')).render(
    <ProductsProvider>
      <CartProvider>
         <App />
    </CartProvider>
    </ProductsProvider>
  
)
