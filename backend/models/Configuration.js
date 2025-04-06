const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
    required: true
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color'
  }, 
  accessories: [{
    _id: false,
    accessory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accessory'
    },
    name: String,
    price: Number
  }],
  totalPrice: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Configuration', configurationSchema);