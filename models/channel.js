'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChannelSchema = Schema({
  name: String,
  user: String,
  description: String,
  signupDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Channel', ChannelSchema);
