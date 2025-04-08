const Color = require('../models/Color');
const Variant = require('../models/Variant');

// @desc   Add color to variant
// @route  POST /api/colors/:variantId/colors
exports.addColor = async (req, res) => {
    try {
        const { name, price, hexCode } = req.body;
        const { variantId } = req.params;

        const variant = await Variant.findById(variantId);
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: 'Variant not found'
            });
        }

        const color = await Color.create({ 
            name, 
            price, 
            hexCode,
            variantId 
        });

        await Variant.findByIdAndUpdate(variantId, {
            $push: { colors: color._id }
          });

        res.status(201).json({
            success: true,
            data: color
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get variant colors
// @route   GET /api/colors/:variantId/colors
exports.getColors = async (req, res) => {
    try {
      const colors = await Color.find({ variantId: req.params.variantId });
      res.status(200).json({
        success: true,
        count: colors.length,
        data: colors
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
};

//@desc  Delete color by id
//@route DELETE /api/colors/:id
exports.deleteColor = async (req, res) => {
    try {
        const { colorId } = req.params;

        const color = await Color.findByIdAndDelete(colorId);

        if (!color) {
            return res.status(404).json({
                success: false,
                message: 'Color not found'
            });
        }

        await Variant.updateMany(
            { colors: colorId },
            { $pull: { colors: colorId } }
        );

        res.status(200).json({
            success: true,
            message: 'Color deleted successfully',
            data: {}
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.addMultipleColors = async (req, res) => {
    try {
      const { variantId } = req.params;
      const { colors } = req.body;
  
      // Validate variant exists
      const variant = await Variant.findById(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant not found'
        });
      }
  
      // Create colors with variant reference
      const createdColors = await Color.insertMany(
        colors.map(color => ({ ...color, variantId }))
      );
  
      // Add color IDs to variant's colors array
      await Variant.findByIdAndUpdate(variantId, {
        $push: { colors: { $each: createdColors.map(c => c._id) } }
      });
  
      res.status(201).json({
        success: true,
        count: createdColors.length,
        data: createdColors
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };