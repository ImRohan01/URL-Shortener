import React from 'react'
import Header from './Header.js'
import Footer from './Footer.js'
import Body from './Body.js'
import './App.css'

function Landing() {
    return (
        <div className="landing-page">
          <Header loggedIn = {false}/>
          <Body />
          <Footer />
        </div>
      )
}

export default Landing
