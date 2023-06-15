const mongoose = require('mongoose')
const Schema = mongoose.Schema
const utils = require('./../utils')
require('mongoose-type-email')

// schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true    
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String    
  },
  bio: {
    type: String    
  },
  accessLevel: {
    type: Number,
    required: true   
  },
  newUser: {
    type: Boolean,
    default: true   
  },
  favouriteClothings: [
    { type: Schema.ObjectId, ref: 'Clothing' }
  ],
  favouriteShoes: [
    { type: Schema.ObjectId, ref: 'Shoe' }
  ],
  favouriteAccessories: [
    { type: Schema.ObjectId, ref: 'Accessorie' }
  ]
  
}, { timestamps: true })

// encrypt password field on save
userSchema.pre('save', function(next) {
  // check if password is present and is modifed  
  if( this.password && this.isModified() ){
      this.password = utils.hashPassword(this.password);
  }
  next()
})

// model
const userModel = mongoose.model('User', userSchema)

// export
module.exports = userModel




