import React, { useEffect, useState } from 'react';
import NavbarComponent from './components/NavbarComponent';
import LandingPage from './pages/LandingPage';
import Confetti from 'react-confetti';
import FooterBanner from './components/FooterComponent';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {


  return (
    <>
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover  
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <NavbarComponent />
      <LandingPage />
      <FooterBanner />
    </>
  );
}

export default App;
