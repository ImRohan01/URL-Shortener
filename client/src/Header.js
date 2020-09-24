import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Header({loggedIn}) {
    const handleLogout = async () => {
        const token = localStorage.getItem("refreshToken")
        localStorage.removeItem("email")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        const body = {
            token: token
        }
        const res = await axios.post("http://localhost:4000/auth/logout",body)
        console.log(res)
    }
    return (
        <div className = "header">
            <h1>ShrinkURL</h1>
            <div className = "header-button">{!loggedIn?<Link to="/authentication"><button>Login | Register</button></Link>:<Link to ="/"><button onClick = {() => {handleLogout()}}>Logout</button></Link>}</div>
        </div>
    )
}

export default Header
