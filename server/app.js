require('dotenv').config()

const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const db = require('./config.js')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/auth',authRoutes)

app.post('/shorten', authenticateToken ,async (req,res) => {
    const url = req.body.url
    const email = req.body.email
    const shortenedURL = shortenURL()
    console.log(shortenedURL)
    const data = {
        email: email,
        longURL: url,
        shortURL: shortenedURL
    }
    try{
        console.log(data)
        const msg = await db.collection('Shortened URLs').doc().set(data)
        return res.status(201).json(data)
    }
    catch(err){
        res.status(500).send(err)
    }
})

app.post('/getURLs', authenticateToken, async (req,res) => {
    const email = req.body.email
    try{
        const userURLs = []
        const urlRef = await db.collection('Shortened URLs').where("email","==",email).get()
        if(urlRef.empty){
            return res.status(201).json({userURLs})
        }
        urlRef.forEach((doc) => {
            userURLs.push(doc.data())
        })
        res.status(201).json({userURLs : userURLs})
    }
    catch(err){
        res.status(500).json(err)
    }

})
app.get('/:shortcode', async (req,res) => {
    const shortURL = req.params.shortcode
    try{
        const urlRef = await db.collection("Shortened URLs").where("shortURL","==",shortURL).get()
        console.log(urlRef)
        urlRef.forEach((doc) => {
            const url = doc.data().longURL
            console.log(url)
            return res.redirect(url)
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    console.log(req.headers)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
      if (err) return res.sendStatus(403)
      next()
    })
}

function shortenURL() {
    // This function basically generates a unique ID
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

// Port
const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})