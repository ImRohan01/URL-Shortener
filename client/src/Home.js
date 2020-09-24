import React,{useState,useEffect} from 'react'
import Header from './Header.js'
import Footer from './Footer.js'
import axios from 'axios'

function Home() {
    const [userURLs, setUserURLs] = useState([])
    const [currURL, setCurrURL] = useState("")
    const [shortURL, setShortURL] = useState("")
    const [shrinked,setShrinked] = useState(false)
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refereshToken")
    const email = localStorage.getItem("email")

    useEffect(() => {
        const fetchItems = async () => {
            try{
                const body = {email: email}
                const header = {authorization: 'Bearer ' + accessToken}
                const res = await axios.post("http://localhost:4000/getURLs",body,{headers: header})
                setUserURLs(res.data.userURLs)
            }catch{
                try{
                    const token = await axios.post("http://localhost:4000/auth/token",{token: refreshToken})
                    localStorage.setItem("accessToken",token.data.accessToken)
                    fetchItems()
                }
                catch{
                    return "User not authorized."
                }
            }  
        }
        fetchItems()   
    },[])

    useEffect(() => {
        console.log(userURLs)
    },[userURLs,shortURL,shrinked])

    const listURLs = () => {
        if(userURLs.length === 0){
            return
        }
        else{
            return (
                userURLs.map((ele) => 
                    <h2>{ele.longURL} =&gt; http://localhost:4000/{ele.shortURL}</h2>
                )
            )
        }
    }

    const handleShrink = async () => {
        const header = {authorization: 'Bearer ' + accessToken}
        const res = await axios.post("http://localhost:4000/shorten",{url: currURL, email: email},{headers: header})
        setShortURL("http://localhost:4000/" + res.data.shortURL)
        setShrinked(true)
        window.location.reload(false)
    }

    return (
        <div className = "home">
            <Header loggedIn = {true}/>
            <h2>Welcome, {email} </h2>
            <div className = "home-container">
                <input placeholder = "URL" value = {currURL} name = "longURL" onChange = {(e) => {setCurrURL(e.target.value)}}></input>
                <button onClick = {() => handleShrink()}>Shrink</button>
            </div>
            {shrinked?<h2>{shortURL}</h2>:""}
            <h2>Your URLs</h2>
            {userURLs?listURLs():""}
            <Footer />
        </div>
    )
}

export default Home
