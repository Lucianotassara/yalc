"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  nombre: {
    type: String,
  },
  url: {
    type: String,
  },
  faIcon: {
    type: String,
  },
  shortUrl: {
    type: String,
  },
  requests: {
    type: Number,
    default: 0,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessed: {
    type: Date,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Url", UrlSchema);
