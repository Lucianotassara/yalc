'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  nombre: {
    type: String
  },
  googleId: {
    type: String
  },
  email: {
    type: String
  },
  profilePicture: {
    type: String
  },
  lastAccessed: {
      type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);
