const Model = require('../models/Model');
const Variant = require('../models/Variant');
const upload = require('../middleware/upload');
const { uploadFile } = require('../utils/s3Upload');
const fs = require('fs');

exports.uploadModelImage = upload.single('image');

// @desc    Create a new models
// @route   POST /api/models
// @access  Public
exports.createModel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        const tempPath = req.file.path;
        const modelName = req.body.name;

        //upload image to s3
        const result = await uploadFile({
            path: tempPath,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype
        }, modelName);

        fs.unlinkSync(tempPath);

        const model = await Model.create({
            name: req.body.name,
            image: result.Location,
        });
        
        res.status(201).json({
            success: true,
            data: model
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all models
// @route   GET /api/models
// @access  Public
exports.getModels = async (req, res) => {
    try {
        const models = await Model.find().populate('variants');
        res.status(200).json({
            success: true,
            count: models.length,
            data: models
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getModel = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id).populate('variants');
        if (!model) {
            return res.status(404).json({
                success: false,
                message: 'Model not found'
            });
        }
        res.status(200).json({
            success: true,
            data: model
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Server Error'
        });
    }
}

// @desc    Get variants for a model
// @route   GET /api/models/:modelId/variants
// @access  Public
exports.getModelVariants = async (req, res) => {
    try {
        const variants = await Variant.find({ modelId: req.params.id });
        res.status(200).json({
            success: true,
            count: variants.length,
            data: variants
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Server Error'
        });
    }
};