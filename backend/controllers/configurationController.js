const Configuration = require('../models/Configuration');
const Model = require('../models/Model');
const Variant = require('../models/Variant');
const Color = require('../models/Color');
const Accessory = require('../models/Accessory');

// @desc    Create a new configuration
// @route   POST /api/configurations
exports.createConfiguration = async (req, res) => {
    try {
        const { modelId, variantId, colorId, accessoryIds } = req.body;

        // Validate references exits or not
        const [model, variant, color] = await Promise.all([
            Model.findById(modelId),
            Variant.findById(variantId),
            Color.findById(colorId),
        ]);

        if (!model || !variant || !color) {
            return res.status(404).json({
                success: false,
                message: 'Invalid model, variant or color reference',
            });
        }

        // Get selected accessories
        const accessories = await Accessory.find({ _id: { $in: accessoryIds } });

        // Calculate total price
        const basePrice = variant.price;
        const colorPrice = color.price || 0;
        const accessoriesPrice = accessories.reduce((total, accessory) => total + accessory.price, 0);

        const totalPrice = basePrice + colorPrice + accessoriesPrice;

        // Create configuration
        const configuration = await Configuration.create({
            model: modelId,
            variant: variantId,
            color: colorId,
            accessories: accessories.map(accessory => ({
                accessory: accessory._id,
                name: accessory.name,
                price: accessory.price,
            })),
            totalPrice,
        });

        res.status(201).json({
            success: true,
            data: configuration,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get configuration by ID
// @route   GET /api/configurations/:id
exports.getConfigurationById = async (req, res) => {
    try {
        const configuration = await Configuration.findById(req.params.id)
            .populate('model')
            .populate('variant')
            .populate('accessories.accessory');

        if (!configuration) {
            return res.status(404).json({
                success: false,
                message: 'Configuration not found',
            });
        }

        res.status(200).json({
            success: true,
            data: configuration,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get all configurations
// @route   GET /api/configurations
exports.getAllConfigurations = async (req, res) => {
    try {
        const configurations = await Configuration.find()
            .populate('model')
            .populate('variant')

        res.status(200).json({
            success: true,
            data: configurations,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Update a configuration
// @route   PUT /api/configurations/:id
exports.updateConfiguration = async (req, res) => {
    try {
      const { colorId, accessoryIds } = req.body;
      const config = await Configuration.findById(req.params.id);
  
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuration not found'
        });
      }
  
      // Get new color if changed
      let colorUpdate = config.color;
      if (colorId && colorId !== config.color._id.toString()) {
        const newColor = await Color.findById(colorId);
        if (!newColor) {
          return res.status(400).json({
            success: false,
            message: 'Invalid color reference'
          });
        }
        colorUpdate = {
          _id: newColor._id,
          name: newColor.name,
          hexCode: newColor.hexCode,
          price: newColor.price
        };
      } 
  
      // Get accessories
      const accessories = await Accessory.find({
        _id: { $in: accessoryIds || config.accessories.map(a => a.accessory) }
      });
  
      // Recalculate total price
      const variant = await Variant.findById(config.variant);
      const basePrice = variant.price;
      const colorPrice = colorUpdate.price;
      const accessoriesPrice = accessories.reduce((sum, acc) => sum + acc.price, 0);
      const totalPrice = basePrice + colorPrice + accessoriesPrice;
  
      // Update configuration
      const updatedConfig = await Configuration.findByIdAndUpdate(
        req.params.id,
        {
          color: colorUpdate,
          accessories: accessories.map(acc => ({
            accessory: acc._id,
            name: acc.name,
            price: acc.price
          })),
          totalPrice
        },
        { new: true, runValidators: true }
      ).populate('model variant');
  
      res.status(200).json({
        success: true,
        data: updatedConfig
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
};

// @desc    Delete a configuration
// @route   DELETE /api/configurations/:id
exports.deleteConfiguration = async (req, res) => {
    try {
      const config = await Configuration.findByIdAndDelete(req.params.id);
  
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuration not found'
        });
      }
  
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