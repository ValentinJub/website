const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  likes: {
    type: [String],
    default: [],
  }
});

module.exports = userSchema;
