const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['accessory', 'feature']
  }
});

module.exports = mongoose.model('Category', categorySchema);