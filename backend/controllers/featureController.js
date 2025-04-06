const Feature = require('../models/Feature');
const Variant = require('../models/Variant');
const { uploadFile } = require('../utils/s3Upload');
const upload = require('../middleware/upload');
const fs = require('fs');

// @desc Add feature to variant
// @route POST /api/features
exports.addFeature = async (req, res) => {
    try {
        const { name, category, variantId } = req.body;
        const variant = await Variant.findById(variantId).populate('modelId');

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: 'Variant not found'
            });
        }

        const modelName = variant.modelId.name.replace(/\s+/g, '').replace(/^(.)/, (match) => match.toLowerCase());
        let imageUrl = '';
        let videoUrl = '';

        //Handle video upload if present
        if (req.files['image']) {
            const imageResult = await uploadFile({
                path: req.files['image'][0].path,
                originalname: req.files['image'][0].originalname,
                mimetype: req.files['image'][0].mimetype
              }, modelName);
              imageUrl = imageResult.Location;
              fs.unlinkSync(req.files['image'][0].path);
        }

        // Handle video upload if present
        if (req.files['video']) {
            const videoResult = await uploadFile({
            path: req.files['video'][0].path,
            originalname: req.files['video'][0].originalname,
            mimetype: req.files['video'][0].mimetype
            }, modelName);
            videoUrl = videoResult.Location;
            fs.unlinkSync(req.files['video'][0].path);
        }

        const feature = await Feature.create({
            name,
            category,
            image: imageUrl,
            video: videoUrl,
            availableOn: [variantId]
        });

        // Add feature to variant
        await Variant.findByIdAndUpdate(variantId, {
            $push: { features: feature._id }
        });

        res.status(201).json({
            success: true,
            data: feature
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc Get feature for a variant
// @route GET /api/variants/:variantId/features
exports.getFeatures = async (req, res) => {
    try {
        const features = await Feature.find({ availableOn: req.params.variantId });
        res.status(200).json({
            success: true,
            count: features.length,
            data: features
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};