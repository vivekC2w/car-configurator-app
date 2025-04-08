const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hexCode: {
    type: String,
    required: true,
    match: /^#[0-9A-F]{6}$/i
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
    required: true
  }
});

module.exports = mongoose.model('Color', colorSchema);