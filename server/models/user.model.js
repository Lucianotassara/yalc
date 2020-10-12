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
  picture: {
    type: String
  },
  displayName: {
    type: String
  },
  email: {
    type: String
  },
  lastAccessed: {
      type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);
