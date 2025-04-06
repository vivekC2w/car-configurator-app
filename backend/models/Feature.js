const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Performance', 'Safety', 'Technology', 'Comfort']
  },
  image: String,
  video: String,
  availableOn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Feature', featureSchema);