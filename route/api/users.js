const express = require('express')
const bcrypt  = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')

const passport = require('passport')

const secret = require('../../config/keys').secretOrKey

//Validation of User data
const validateRegisterInput = require('../../validation/regiter')
const validateLoginInput = require('../../validation/login')

const router = express.Router()

//Load User model
const User = require('../../models/User')

// @route GET users/test
// @desc Test API bro
router.get('/test',(req,res)=> res.json({msg:'Your server is working bro!!!',status:'Nice'}))

// @route POST users/register
// @desc Register API
router.post('/register',(req,res)=>{
    const {errors,isValid} = validateRegisterInput(req.body)

    if(!isValid){
        res.status(400).json(errors)
    }

    User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
                errors.email = 'email already exists';
                return res.status(400).json(errors)
            }else{
                const avatar = gravatar.url(req.body.email , {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })
                const newUser = new User({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email,
                    avatar,
                })
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err)
                            throw err;
                        newUser.password=hash
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err=>console.log(err))
                    })
                })
            }
        })
})
// @route POST users/login
// @desc Login API
router.post('/login',(req, res) => {
    const {errors,isValid} = validateLoginInput(req.body)

    if(!isValid){
        res.status(400).json(errors)
    }

    const email = req.body.email
    const password = req.body.password
    User.findOne({email}).then(user =>{
            if(!user){
                errors.email = 'User not found'
                return res.status(404).json(errors)
            }
            const payload = {email, password,avatar:req.body.avatar}
            bcrypt.compare(password ,user.password).then(check=>{
                if(check){
                    jwt.sign(payload,
                        secret,
                        {expiresIn: 3600},
                        (err,token)=>{
                            res.json({
                                success:'true',
                                token:'Bearer '+token
                            })
                        })
                }
                else {
                    errors.password = 'Password incorrect'
                    res.status(400).json(errors)
                }
            })
    })
})

//@route users/current
//@desc Return current user API
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
);




module.exports = router