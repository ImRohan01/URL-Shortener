// Configuring Firebase 
const firebase = require('firebase-admin')
const serviceAccount = require('./ServiceAccountKey.json')

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
})

// Database Reference
const db = firebase.firestore()

module.exports = db