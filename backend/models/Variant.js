const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a variant name'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a variant price'],
  },
  range: {
    type: Number,
    required: [true, 'Please add a range'],
  },
  acceleration: {
    type: String,
    required: [true, 'Please add an acceleration'],
  },
  colors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color'
  }],
  accessories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accessory'
  }],
  features: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feature'
  }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Variant', variantSchema);