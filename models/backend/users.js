const mongoose = require('mongoose');
var exerciseSchema = require('../../models/backend/exercises')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
log: [exerciseSchema]
}, {versionKey: false});

module.exports = userSchema;