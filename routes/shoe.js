const express = require('express')
const router = express.Router()
const utils = require('../utils')
const Shoe = require('../models/Shoe')
const path = require('path')

// GET- get all shoes ---------------------------
router.get('/', utils.authenticateToken, (req, res) => {
  Shoe.find().populate('_id name')
    .then(shoes => {
      if(shoes == null){
        return res.status(404).json({
          message: "No shoes found"
        })
      }
      res.json(shoes)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting shoes"
      })
    })  
})

// POST - create new shoes --------------------------------------
router.post('/', (req, res) => {
    // validate 
    if(Object.keys(req.body).length === 0){   
      return res.status(400).send({message: "shoes content can't be empty"})
    }
    // validate - check if image file exist
    if(!req.files || !req.files.image){
      return res.status(400).send({message: "Image can't be empty"})
    }
  
    console.log('req.body = ', req.body)
  
    // image file must exist, upload, then create new shoes
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
      // create new shoes
      let newShoe = new Shoe({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: uniqueFilename,
        size: req.body.size,
        material: req.body.material
      })
    
      newShoe.save()
      .then(shoe => {        
        // success!  
        // return 201 status with shoes object
        return res.status(201).json(shoe)
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send({
          message: "Problem creating shoes",
          error: err
        })
      })
    })
  })
  
  // export
  module.exports = router
  
  