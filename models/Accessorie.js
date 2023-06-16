const mongoose = require('mongoose')
const Schema = mongoose.Schema
const utils = require('../utils')

// schema
const accessorieSchema = new mongoose.Schema({
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
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
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
const accessorieModel = mongoose.model('Accessorie', accessorieSchema)

// export
module.exports = accessorieModel