import React,{useState,useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import axios from 'axios'

function Authentication() {
    const [auth,setAuth] = useState("login")
    const [name,setName] = useState("")
    const [password, setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [phone,setPhone] = useState("")
    const [status,setStatus] = useState("")

    useEffect(() => {
        console.log(auth)
        setEmail("")
        setPassword("")
        setName("")
        setPhone("")
    },[auth])

    useEffect(() => {
        console.log(name,password,email,phone)
    },[name,password,phone,email,status])

    const handleSubmit = async () => {
        if(auth === "login"){
            let body = {
                email: email,
                password: password
            }
            const res = await axios.post("http://localhost:4000/auth/login",body)
            if(res.status !== 200){
                setStatus("incorrect")
                return
            }
            const data = res.data
            if(data.status !== true){
                setStatus("incorrect")
                return
            }
            else{
                setStatus("loggedIn")
                console.log(data)
                localStorage.setItem('accessToken',data.accessToken)
                localStorage.setItem('refreshToken',data.refreshToken)
                localStorage.setItem('email',email)
                window.location.reload(false)
            }
        }
        else{
            let body = {
                name: name,
                email: email,
                password: password,
            }

            if(phone !== ""){
                body["phone"] = phone
            }

            const res = await axios.post("http://localhost:4000/auth/register",body)
            console.log(res)
            if(res.status === 200 && res.data !== undefined){
                const data = res.data
                console.log(data)
                if(data.status === false){
                    setStatus("exists")
                }
                else{
                    setStatus("registered")
                    setAuth("login")
                } 
            }
        }
    }

    const message = () => {
        if(status === "registered"){
            return (
                <h3>Registration successful!</h3>
            )
        }
        else if(status === "exists"){
            return (
                <h3>User already exists!</h3>
            )
        }
        else if(status === "incorrect"){
            return (
                <h3>Incorrect username/password! Try again</h3>
            ) 
        }
        else{
            return(
                <h3> </h3>
            )
        }
    }

    const login = () => {
        return (
            <div className="auth-body">
                {message()}
                <input type = "text" name = "email" value = {email} placeholder="E-mail" required onChange = {(e) => setEmail(e.target.value)}></input>
                <input type = "password" name = "password" value = {password} placeholder="Password" required onChange = {(e) => setPassword(e.target.value)}></input>
                <button type="submit" onClick = {handleSubmit}>Login</button>
            </div>
        )
    }

    const register = () => {
        return (
            <div className="auth-body">
                {message()}
                <input type = "text" name = "name" value = {name} placeholder="Full Name" required onChange = {(e) => setName(e.target.value)}></input>
                <input type = "text" value = {email} placeholder="E-mail" required onChange = {(e) => setEmail(e.target.value)}></input>
                <input type = "password" value = {password} placeholder="Password" required onChange = {(e) => setPassword(e.target.value)}></input>
                <input type = "text" value = {phone} placeholder="Phone (Optional)" onChange = {(e) => setPhone(e.target.value)}></input>
                <button type="submit" onClick={handleSubmit}>Register</button>
            </div>
        )
    }

    return (
        status === "loggedIn"?<Redirect to="/home"/>:
        <div className="authentication">
            <h1>ShrinkURL</h1>
            <h2>Login or create a free account here!</h2>
            <div className="auth-container">
                <div className="toggle-auth">
                    <button onClick={()=>{setAuth("login")}}>Login</button>
                    <button onClick={()=>{setAuth("register"); setStatus("")}}>Register</button>
                </div>
                {auth === "login"?login():register()}
            </div>
        </div>
    )
}

export default Authentication
