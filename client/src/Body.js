import React from 'react'
import image from './img/img1.webp'

function Body() {
    return (
        <div className = "lp-container">
            <div>
                <h1>Shrink to Grow</h1>
                <h2>A simple URL shortener to help you reduce the hassle of sharing links</h2>
            </div>
            <img src = {image} alt = "lp" />
        </div>
    )
}

export default Body
