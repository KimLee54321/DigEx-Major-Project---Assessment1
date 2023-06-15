const express = require('express')
const router = express.Router()
const utils = require('./../utils')
const User = require('./../models/User')
const path = require('path')


// PUT - add favourite Clothes --------------------------------------
router.put('/addFavClothing/', Utils.authenticateToken, (req, res) => {  
  // validate check
  if(!req.body.clothingId){
    return res.status(400).json({
      message: "No clothing specified"
    })
  }
  // add clothingId to favourite clothes field (array - push)
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      favouriteClothings: req.body.clothingId
    }
  })
    .then((user) => {            
      res.json({
        message: "Clothing added to favourites"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding favourite clothes"
      })
    })
})

// PUT - add favourite shoes --------------------------------------
router.put('/addFavShoe/', Utils.authenticateToken, (req, res) => {  
  // validate check
  if(!req.body.shoeId){
    return res.status(400).json({
      message: "No shoes specified"
    })
  }
  // add shoesId to favourite shoes field (array - push)
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      favouriteShoes: req.body.shoeId
    }
  })
    .then((user) => {            
      res.json({
        message: "Shoes added to favourites"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding favourite shoes"
      })
    })
})

// PUT - add favourite accessories --------------------------------------
router.put('/addFavAccessorie/', Utils.authenticateToken, (req, res) => {  
  // validate check
  if(!req.body.accessorieId){
    return res.status(400).json({
      message: "No accessories specified"
    })
  }
  // add accessorieId to favourite accessories field (array - push)
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      favouriteAccessories: req.body.accessorieId
    }
  })
    .then((user) => {            
      res.json({
        message: "Accessories added to favourites"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding favourite accessories"
      })
    })
})

// GET - get single user -------------------------------------------------------
router.get('/:id', utils.authenticateToken, (req, res) => {
  if(req.user._id != req.params.id){
    return res.status(401).json({
      message: "Not authorised"
    })
  }

  User.findById(req.params.id).populate('favouriteClothings ')
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Couldn't get user",
        error: err
      })
    })
})


// PUT - update user ---------------------------------------------
router.put('/:id', Utils.authenticateToken, (req, res) => {
  // validate request
  if(!req.body) return res.status(400).send("Task content can't be empty")
  
  let avatarFilename = null

  // if avatar image exists, upload!
  if(req.files && req.files.avatar){
    // upload avater image then update user
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
      avatarFilename = uniqueFilename
      // update user with all fields including avatar
      updateUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: avatarFilename, 
        bio: req.body.bio,   
        accessLevel: req.body.accessLevel      
      })
    })
  }else{
    // update user without avatar
    updateUser(req.body)
  }
  
  // update User
  function updateUser(update){    
    User.findByIdAndUpdate(req.params.id, update, {new: true})
    .then(user => res.json(user))
    .catch(err => {
      res.status(500).json({
        message: 'Problem updating user',
        error: err
      })
    }) 
  }
})

// POST - create new user --------------------------------------
router.post('/', (req, res) => {
  // validate request
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "User content can not be empty"})
  }

  // check account with email doen't already exist
  User.findOne({email: req.body.email})
  .then(user => {
    if( user != null ){
      return res.status(400).json({
        message: "email already in use, use different email address"
      })
    }
  // create new user       
  let newUser = new User(req.body)
  newUser.save()
    .then(user => {        
      // success!  
      // return 201 status with user object
      return res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating account",
        error: err
      })
    })
  })
})

module.exports = router