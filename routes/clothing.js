const express = require('express')
const router = express.Router()
const utils = require('./../utils')
const Clothing = require('./../models/Clothing')
const path = require('path')

// GET- get all clothings ---------------------------
router.get('/', utils.authenticateToken, (req, res) => {
    Clothing.find().populate('_id name')
    .then(clothings => {
      if(clothings == null){
        return res.status(404).json({
          message: "No clothing found"
        })
      }
      res.json(clothings)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting clothings"
      })
    })  
})

// POST - create new clothing --------------------------------------
router.post('/', (req, res) => {
    // validate 
    if(Object.keys(req.body).length === 0){   
      return res.status(400).send({message: "clothing content can't be empty"})
    }
    // validate - check if image file exist
    if(!req.files || !req.files.image){
      return res.status(400).send({message: "Image can't be empty"})
    }
  
    console.log('req.body = ', req.body)
  
    // image file must exist, upload, then create new clothing
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
      // create new clothing
      let newClothing = new Clothing({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: uniqueFilename,
        size: req.body.size,
        material: req.body.material
      })
    
      newClothing.save()
      .then(clothing => {        
        // success!  
        // return 201 status with clothing object
        return res.status(201).json(clothing)
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send({
          message: "Problem creating clothing",
          error: err
        })
      })
    })
  })
  
  // export
  module.exports = router
  
  