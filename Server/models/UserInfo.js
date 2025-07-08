const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String},
    googleId: { type: String },
    appleId: { type: String },
    email: { type: String, required: true},
    full_name: { type: String, maxlength: 100},
  });
  
  module.exports = mongoose.model('User', UserSchema);