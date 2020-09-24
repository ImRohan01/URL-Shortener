require('dotenv').config()

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../config.js')
const jwt = require('jsonwebtoken')

//Routes
router.post('/logout', async (req, res) => {
    let tokensRef = await db.collection('Refresh Tokens').doc('1').get()
    let refreshTokens = tokensRef.data().refreshTokens
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    const msg = await db.collection('Refresh Tokens').doc(tokensRef.id).update({refreshTokens: refreshTokens})
    console.log(msg)
    res.status(204)
})

router.post('/token', async (req,res) => {
    const refreshToken = req.body.token
    if (!refreshToken){
        return res.status(401).json({status: false})
    }
    let tokensRef = await db.collection('Refresh Tokens').doc('1').get()
    let refreshTokens = tokensRef.data().refreshTokens
    if (!refreshTokens.includes(refreshToken)){
        return res.status(403).json({status: false})
    } 
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({status: false})
        }
        const accessToken = generateAccessToken({ name: user.name })
        return res.status(201).json({ accessToken: accessToken })
    })
})

router.post('/register', async (req,res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        let user = req.body
        const userRef = await db.collection('Users').where("email","==",user.email).get()
        if(!userRef.empty){
            return res.status(200).json({status: false, message: "User already exists!"})
        }
        user['password'] = hashedPassword
        const msg = await db.collection('Users').doc().set(user)
        console.log(msg)
        res.status(200).json({status: true, message:"Registration Successful!"})
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.post('/login',async (req,res) => {
    const email = req.body.email
    const password = req.body.password

    const userCred = await db.collection('Users').where('email','==',email).get()
    if(userCred.empty){
        res.status(400).json({status: false})
        return
    }
    try{
        userCred.forEach(async (doc) => {
            const user = doc.data()
            console.log(user)
            if(await bcrypt.compare(password,user.password)){
                const data = {user: user.email}
                try{
                    const accessToken = generateAccessToken(data)
                    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET)
                    let tokensRef = await db.collection('Refresh Tokens').doc('1').get()
                    let refreshTokens = tokensRef.data().refreshTokens
                    refreshTokens.push(refreshToken)
                    console.log(refreshTokens)
                    const msg = await db.collection('Refresh Tokens').doc(tokensRef.id).update({refreshTokens: refreshTokens})
                    console.log(msg)
                    res.status(200).json({status: true, accessToken: accessToken, refreshToken: refreshToken})
                    return
                }
                catch(err){
                    res.status(500).send(err)
                    return 
                }
            }
            res.status(400).json({status: false})
            return
        })
    }
    catch(err){
        res.status(500).json(err)
    }
})

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6000s' })
}
  
module.exports = router