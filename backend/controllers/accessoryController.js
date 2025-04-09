const Accessory = require('../models/Accessory');
const Variant = require('../models/Variant');
const { uploadFile, deleteFile } = require('../utils/s3Upload');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// @desc  Create new accessory
// @route POST /api/accessories
exports.createAccessory = async (req, res) => {
    try {
        const { name, category, price, variantId } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        //get the variant to ensure it exists
        const variant = await Variant.findById(variantId).populate('modelId');
        
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: 'Variant not found'
            });
        }

        const modelName = variant.modelId.name.replace(/\s+/g, '').replace(/^(.)/, (match) => match.toLowerCase());

        //upload file to s3
        const result = await uploadFile({
            path: req.file.path,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
        }, modelName);

        //create accessory in db
        const accessory = await Accessory.create({
            name,
            category,
            price,
            image: result.Location,
            compatibleVariants: [variantId]
        });

        //add accessory to variant
        await Variant.findByIdAndUpdate(variantId, {
            $push: { accessories: accessory._id }
        });

        // Clean up temp file
        fs.unlinkSync(req.file.path);

        res.status(201).json({
        success: true,
        data: accessory
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: error.message
        });
    }
};

// @desc  Get all accessories
// @route GET /api/accessories
exports.getAccessories = async (req, res) => {
    try {
        const accessories = await Accessory.find().populate('compatibleVariants');

        res.status(200).json({
            success: true,
            data: accessories
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc  Get accessories by variant id
// @route GET /api/accessories/:variantId
exports.getAccessoriesByVariantId = async (req, res) => {
    try {
        const variantId = req.params.variantId;

        const accessories = await Accessory.find({ compatibleVariants: variantId }).populate('compatibleVariants');

        if (!accessories || accessories.length === 0) {
            return res.status(200).json({ 
                success: true,
                data: [],
                message: 'No accessories found for this variant'
            });
        }

        res.status(200).json({
            success: true,
            count: accessories.length,
            data: accessories
        });
    } catch (error) {
        console.error('Error fetching accessories:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: ' + error.message
        });
    }
};

// @desc  Get accessory by id
// @route GET /api/accessories/:id
exports.getAccessoryById = async (req, res) => {
    try {
        const accessory = await Accessory.findById(req.params.id).populate('compatibleVariants');

        if (!accessory) {
            return res.status(404).json({
                success: false,
                message: 'Accessory not found'
            });
        }

        res.status(200).json({
            success: true,
            data: accessory
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete accessory
// @route   DELETE /api/accessories/:id
exports.deleteAccessory = async (req, res) => {
    try {
      const accessory = await Accessory.findById(req.params.id);
      
      if (!accessory) {
        return res.status(404).json({
          success: false,
          message: 'Accessory not found'
        });
      }
  
      // 1. Delete image from S3
      const key = accessory.image.split('/').slice(3).join('/');
      await deleteFile(key).catch(err => {
        console.error('S3 deletion error:', err);
      });
  
      // 2. Remove accessory reference from all variants
      await Variant.updateMany(
        { _id: { $in: accessory.compatibleVariants } },
        { $pull: { accessories: accessory._id } }
      );
  
      // 3. Delete accessory document
      await Accessory.deleteOne({ _id: accessory._id });
  
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
};

exports.searchAccessories = async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice } = req.query;

        let searchQuery = {};

        // Text search
        if (query) {
          searchQuery.$or = [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ];
        }

        // Category filter
        if (category) {
          searchQuery.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
          searchQuery.price = {};
          if (minPrice) searchQuery.price.$gte = Number(minPrice);
          if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
        }

        const accessories = await Accessory.find(searchQuery).populate(
          "compatibleVariants"
        );

        res.status(200).json({
          success: true,
          count: accessories.length,
          data: accessories,
        });
    } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
    }
};