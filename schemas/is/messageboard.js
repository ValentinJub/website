const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  text: { 
    type: String,
    required: true,
    unique: true
  }
});

const replySchema = new mongoose.Schema({
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Threads',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    created_on: {
      type: Date,
      default: new Date()
    },
    password: {
      type: String,
      required: true
    },
    reported: {
      type: Boolean,
      default: false
    }
});

const threadSchema = new mongoose.Schema({
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boards',
      required: true
    },
    text: { 
      type: String,
      required: true
    },
    created_on: {
      type: Date,
      default: new Date()
    },
    bumped_on: {
      type: Date,
      default: new Date()
    },
    reported: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    replies: [{
      type: Object,
      default: []
    }]
});

module.exports = { boardSchema, threadSchema, replySchema };