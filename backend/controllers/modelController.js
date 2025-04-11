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

//@desc Get Model By Model Name
//@route GET /api/models/name
exports.getModelByName = async (req, res) => {
    try {
        const modelName = decodeURIComponent(req.params.name);
        const model = await Model.findOne({ name: modelName });
        
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
            message: error.message || 'Server Error'
        });
    }
}

 // @desc Search models by name and price range
// @route GET /api/models/search
exports.searchModels = async (req, res) => {
    try {
      const { query, minPrice, maxPrice } = req.query;
  
      const pipeline = [];
  
      // Match models by name
      if (query) {
        pipeline.push({
          $match: {
            name: { $regex: query, $options: 'i' }
          }
        });
      }
  
      // Lookup variants for each model
      pipeline.push({
        $lookup: {
          from: 'variants',
          let: { modelId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$modelId', '$$modelId'] },
                    ...(minPrice ? [{ $gte: ['$price', Number(minPrice)] }] : []),
                    ...(maxPrice ? [{ $lte: ['$price', Number(maxPrice)] }] : [])
                  ]
                }
              }
            },
            { $limit: 5 }
          ],
          as: 'variants'
        }
      });
  
      // If price filter applied, ensure variants exist
      if (minPrice || maxPrice) {
        pipeline.push({
          $match: {
            variants: { $ne: [] }
          }
        });
      }
  
      // Project model fields + filtered variants
      pipeline.push({
        $project: {
          name: 1,
          image: 1,
          price: 1,
          variantCount: {
            $cond: {
              if: { $isArray: '$variants' },
              then: { $size: '$variants' },
              else: 0
            }
          },
          variants: {
            $map: {
              input: '$variants',
              as: 'variant',
              in: {
                name: '$$variant.name',
                price: '$$variant.price',
                range: '$$variant.range',
                acceleration: '$$variant.acceleration'
              }
            }
          }
        }
      });
  
      const models = await Model.aggregate(pipeline);
  
      res.json({ success: true, data: models });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  };
  