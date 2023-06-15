const mongoose = require('mongoose')
const Schema = mongoose.Schema
const utils = require('./../utils')

// schema
const clothingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String    
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true    
  },
  size: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  }
  
}, { timestamps: true })


// model
const clothingModel = mongoose.model('Clothing', clothingSchema)

// export
module.exports = clothingModel