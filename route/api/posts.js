const Router = require('express')
const req = require('express/lib/request')
const passport = require('passport')

const router = new Router

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const validatePostInput = require('../../validation/post')


//@route POST post/
//@desc Create post
//@access Private
router.post('/',passport.authenticate('jwt',{session:false}),(req, res) => {
    const {errors, isValid} = validatePostInput(req.body)

    if(!isValid){
        res.status(400).json(errors)
    }

    const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.name
    })

    newPost.save().then(post=> res.json(post))
})

//@route DELETE post/:id
//@desc Delete post by id
//@access Private
router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post=>{
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({noauth:'Not auth'})
                    }
                    post.remove().then(()=> res.json({succes : true}))
                }).catch(err=> res.status(400).json({nopost:'Not found post'}))
        })
})


//@route GET post/:id
//@desc Get post by id
//@access Public
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{
            res.json(post)
        }).catch(err=> res.status(404).json({nopost:'Not found post'}))
})


//@route GET post/
//@desc Get all posts
//@access Public
router.get('/',(req, res) => {
    Post.find()
        .sort({date: -1})
        .then((posts)=>{res.json(posts)})
        .catch(err=>{
            res.status(404).json({nopost : 'Not found posts'})
        })
})

//@route POST post/comment/:id
//@desc Add comment to post by id
//@access Private
router.post(
    '/comment/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        // Check Validation
        if (!isValid) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
        }

        Post.findById(req.params.id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                };

                // Add to comments array
                post.comments.unshift(newComment);

                // Save
                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    }
);

//@route POST post/like/:id
//@desc Like to post by id
//@access Private
router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req, res) => {

    Post.findById(req.params.id)
        .then((post)=>{
            const errors = {}
            if(post){
                if(post.likes.filter(like => like.user.toString()===req.user.id).length>0){
                    errors.like = 'You already liked this post'
                    res.status(400).json(errors)
                }else{
                    post.likes.unshift({user:req.user.id})
                    post.save().then(post=> res.json(post))
                }
            }
        })
        .catch(err=>{
            res.status(404).json({nopost : 'Not found post'})
        })
})

//@route DELETE post/comment/:id/:comment_id
//@desc Delete comment by id
//@access Private
router.delete('comment/:id/:comment_id',passport.authenticate('jwt',{session:false}), (req, res) => {
    Post.findById(req.params.id)
        .then((post)=>{
            if(post.comments.filter(item=> item._id.toString()===req.params.comment_id).length===0){
                return res.status(400).json({commentnoexist:'Comment not found'})
            }
            const index = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id)
            post.comments.slice(index,1)
            post.save().then(post => res.json(post))
        })
})

//@route DELETE post/unlike
//@desc Unlike post by id
//@access Private
router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req, res) => {
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post=>{
                    if(post.likes.filter(item=> item.user.toString()===req.user.id).length===0){
                        return res.status(400).json({nolike:'You didn\'t like this post'})
                    }
                    const index = post.likes.map(item=>item.user.toString())
                        .indexOf(req.params.id)
                    post.likes.slice(index,1)
                    post.save().then(post=> res.json(post))
                })
        })
})


module.exports = router
