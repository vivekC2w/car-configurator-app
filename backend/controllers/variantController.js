const Variant = require('../models/Variant');
const Model = require('../models/Model');
const Color = require('../models/Color');
const Accessory = require('../models/Accessory');
const Feature = require('../models/Feature');

// @desc Create a new variant
// @route POST /api/variants
exports.createVariant = async (req, res) => {
    try {
        const { modelId, name, price, range, acceleration } = req.body;

        const variant = await Variant.create({
            modelId,
            name,
            price,
            range,
            acceleration
        });

        // add variant to model's variants array
        await Model.findByIdAndUpdate(modelId, { $push: { variants: variant._id } });

        res.status(201).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc Get variant details
// @route GET /api/variants/:id
exports.getVariant = async (req, res) => {
    try {
        const variant = await Variant.findById(req.params.id)
            .populate('modelId')
            .populate('colors')
            .populate('accessories')
            .populate('features');

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: 'Variant not found',
            });
        }

        res.status(200).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete all variants for a model
// @route   DELETE /api/variants/model/:modelId
exports.deleteVariantsByModel = async (req, res) => {
    try {
      const { modelId } = req.params;
  
      // 1. Find all variants for this model
      const variants = await Variant.find({ modelId });
  
    //   // 2. Delete all associated data (colors, accessories, features)
      const variantIds = variants.map(v => v._id);
      
      await Promise.all([
        Color.deleteMany({ variantId: { $in: variantIds } }),
        Accessory.deleteMany({ variantId: { $in: variantIds } }),
        Feature.deleteMany({ variantId: { $in: variantIds } })
      ]);
  
      // 3. Delete the variants themselves
      await Variant.deleteMany({ modelId });
  
      // 4. Remove variant references from the model
      await Model.findByIdAndUpdate(modelId, {
        $set: { variants: [] }
      });
  
      res.status(200).json({
        success: true,
        message: `Deleted ${variants.length} variants and their associated data`,
        data: variants
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // @desc    Delete a single variant
  // @route   DELETE /api/variants/:id
  exports.deleteVariant = async (req, res) => {
    try {
      const variant = await Variant.findByIdAndDelete(req.params.id);
  
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant not found'
        });
      }
  
      // Clean up associated data
      await Promise.all([
        Color.deleteMany({ variantId: variant._id }),
        Accessory.deleteMany({ variantId: variant._id }),
        Feature.deleteMany({ variantId: variant._id })
      ]);
  
      // Remove from model's variants array
      await Model.findByIdAndUpdate(variant.modelId, {
        $pull: { variants: variant._id }
      });
  
      res.status(200).json({
        success: true,
        data: variant
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };