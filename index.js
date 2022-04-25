//Modules
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const colors = require('colors')

//config MongoDB
const config = require('./config/keys')

//Users
const users = require('./route/api/users')
//Profiles
const profiles = require('./route/api/profiles')
//Posts
const posts = require('./route/api/posts')

const PORT = process.env.PORT || 5000
const db = config.mongoURL

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(passport.initialize())
require('./config/passport')(passport)

mongoose.connect(db,{ useNewUrlParser: true })
    .then(()=>console.log(colors.bgCyan('Connect success').black))
    .catch(err=>console.log(err))

app.use('/user',users)
app.use('/profile',profiles)
app.use('/post',posts)

app.listen(PORT,()=>console.log('Server listening on port '+PORT))
