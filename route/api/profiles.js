const Router = require('express')
const passport = require('passport')

//Database from models
const User = require('../../models/User')
const Profile = require('../../models/Profile')

const validateProfileInput = require('../../validation/profile')
const validateExpInput = require('../../validation/experience')
const validateEduInput = require('../../validation/education')

const router = new Router


// test
router.get('/test:id',(req, res) => {
    res.json(req.params.id)
})
router.get('/test',(req, res) => {
    res.json({msg:'with out user_id'})
})

//@route GET /profile
//@desc Return profile
//@access Private
router.get('/',passport.authenticate('jwt',{session:false}),(req, res) => {
    Profile.findOne({user:req.user.id}).populate('user',['name','avatar'] )
        .then(profile =>{
            const errors = {}
            if(profile){
                return res.json(profile)
            }
            errors.noprofile = 'Not found profile'
            return res.status(404).json(errors)
        })
        .catch(err=>res.status(400).json(err))
})

//@route GET /profile/user/:user_id
//@desc Get profile with handle
//@access Public
router.get('/user/:user_id',(req, res) => {
    Profile.findOne({user:req.params.user_id})
        .populate('user',['name','avatar'])
        .then(profile=>{
            const errors = {}
            if(profile){
                return res.json(profile)
            }
            errors.noprofile = 'Not found profile'
            return res.status(404).json(errors)
        })
})



//@route GET /profile/all
//@desc Get all profiles
//@access Public
router.get('/all',(req, res) => {
    const errors = {}

    Profile.find().populate('user',['name','avatar'])
        .then(profiles =>{
            if(!profiles){
                errors.handle = 'There are not profiles'
                res.status(404).json(errors)
            }
            res.json(profiles)
        }).catch(err=>res.status(400).json(err))
})

//@route GET /profile/handle/:handle
//@desc Get profile with handle
//@access Public
router.get('/handle/:handle',(req, res) => {
    const errors = {}

    Profile.findOne({handle:req.params.handle})
        .populate('user',['name','avatar'])
        .then(profile=>{
            if(profile){
                res.json(profile)
            }else {
                errors.handle = 'Not found user with this handle'
                return res.status(404).json(errors)
            }

        }).catch(err=> res.status(400).json(err))

})


//@route GET /profile/
//@desc Get profile with handle
//@access Private
router.post('/',passport.authenticate('jwt',{session:false}),(req, res) => {
    const newProfile = {}
    const {errors,isValid} = validateProfileInput(req.body);

    if(!isValid)
        return res.status(400).json(errors)

    newProfile.user = req.user._id
    if(req.body.handle)newProfile.handle = req.body.handle
    if(req.body.company)newProfile.company = req.body.company
    if(req.body.website)newProfile.website = req.body.website
    if(req.body.location)newProfile.location = req.body.location
    if(req.body.bio)newProfile.bio = req.body.bio
    if(req.body.githubusername)newProfile.githubusername = req.body.githubusername
    if(req.body.status)newProfile.status = req.body.status
    if(typeof req.body.skills !== 'undefined')
        newProfile.skills = req.body.skills.split(',')

    //Social
    newProfile.social = {}
    if(req.body.youtube)newProfile.social.youtube = req.body.youtube
    if(req.body.twitter)newProfile.social.twitter = req.body.twitter
    if(req.body.facebook)newProfile.social.facebook = req.body.facebook
    if(req.body.instagram)newProfile.social.instagram = req.body.instagram
    if(req.body.linkedin)newProfile.social.linkedin = req.body.linkedin

    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(profile){
                Profile.findOneAndUpdate(
                    {user:req.user.id},
                    {$set:newProfile},
                    {new:true}
                    ).then(profile => res.json(profile))
            }else{
                Profile.findOne({handle:newProfile.handle})
                    .then(profile2=>{
                        if(profile2){
                            errors.handle = 'Handle already exists'
                            res.status(400).json(errors)
                        }
                        new Profile(newProfile).save().then(profile =>res.json(profile))
                    })
            }
        })
})

//@route POST /profile/experience
//@desc Add new experience
//@access Private
router.post('/experience',passport.authenticate('jwt',{session:false}),(req, res) => {
    const {errors,isValid} = validateExpInput(req.body);

    if(!isValid)
        return res.status(400).json(errors)

    Profile.findOne({user:req.user.id})
        .then(profile =>{
            const newExr = {
                title : req.body.title,
                company : req.body.company,
                location : req.body.location,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description,
            }

            profile.experience.unshift(newExr)
            profile.save().then(profile => res.json(profile))
        })
})

//@route POST /profile/education
//@desc Add Education
//@access Private
router.post('/education',passport.authenticate('jwt',{session:false}),(req, res)=>{
    const {errors,isValid} = validateEduInput(req.body);

    if(!isValid)
        return res.status(400).json(errors)

    Profile.findOne({user:req.user.id})
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            profile.education.unshift(newEdu)
            profile.save().then(profile => res.json(profile))
        })
})

//@route POST /profile/education/:edu_id
//@desc Delete education by ID
//@access Private
router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),(req, res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            const index = profile.education
                .map(item => item.id)
                .indexOf(req.params.id)

            profile.education.splice(index,1)
            profile.save().then(profile => res.json(profile))
        })
})

//@route POST /profile/experience/:exp_id
//@desc Delete education by ID
//@access Private
router.delete('/experience/:exp_id',passport.authenticate('jwt',{session:false}),(req, res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            const index = profile.experience
                .map(item => item.id)
                .indexOf(req.params.id)

            profile.experience.splice(index,1)
            profile.save().then(profile => res.json(profile))
        })
})

//@route POST /profile
//@desc Delete user and profile
//@access Private
router.delete('/',passport.authenticate('jwt',{session:false}),(req, res)=>{
    Profile.findOneAndRemove({user:req.user.id})
        .then(()=>{
            User.findOneAndRemove({_id:req.user.id})
                .then(()=> res.json({success:true}))
        })

})


module.exports = router