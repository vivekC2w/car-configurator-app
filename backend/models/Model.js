const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a model name'],
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Please add a model image'],
    },
    variants: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant',
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Model', modelSchema);