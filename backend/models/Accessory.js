const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Exterior', 'Interior', 'Performance', 'Technology']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  compatibleVariants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Accessory', accessorySchema);