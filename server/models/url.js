const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');

const urlSchema = new Schema({
  fullUrl: {
    type: String,
    required: true,
    unique: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: () => nanoid(7),
    unique: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = model('Url', urlSchema);
