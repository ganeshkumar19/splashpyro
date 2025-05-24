import React from 'react'
import Home from '../containers/Home'
import Products from '../containers/Products'
import AboutUs from '../containers/AboutUs'
import ContactUsBanner from '../containers/ContactUs'
import SafetyBanner from '../containers/SafetyBanner'

const LandingPage = () => {
  return (
    <>
    <Home/>
    <Products/>
    <AboutUs/>
    <ContactUsBanner/>
    <SafetyBanner/>
    </>
  )
}

export default LandingPage