const express = require('express')
const router = express.Router()
const utils = require('../utils')
const Accessorie = require('../models/Accessorie')
const path = require('path')

// GET- get all Accessories ---------------------------
router.get('/', utils.authenticateToken, (req, res) => {
  Accessorie.find().populate('_id name')
    .then(accessories => {
      if(accessories == null){
        return res.status(404).json({
          message: "No accessories found"
        })
      }
      res.json(accessories)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting accessories"
      })
    })  
})

// POST - create new Accessories --------------------------------------
router.post('/', (req, res) => {
    // validate 
    if(Object.keys(req.body).length === 0){   
      return res.status(400).send({message: "Accessories content can't be empty"})
    }
    // validate - check if image file exist
    if(!req.files || !req.files.image){
      return res.status(400).send({message: "Image can't be empty"})
    }
  
    console.log('req.body = ', req.body)
  
    // image file must exist, upload, then create new accessories
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
      // create new accessories
      let newAccessorie = new Accessorie({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: uniqueFilename,
        size: req.body.size,
        material: req.body.material
      })
    
      newAccessorie.save()
      .then(accessorie => {        
        // success!  
        // return 201 status with accessories object
        return res.status(201).json(accessorie)
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send({
          message: "Problem creating accessories",
          error: err
        })
      })
    })
  })
  
  // export
  module.exports = router
  
  