const Color = require('../models/Color');
const Variant = require('../models/Variant');

// @desc   Add color to variant
// @route  POST /api/variants/:variantId/colors
exports.addColor = async (req, res) => {
    try {
        const { name, price, hexCode } = req.body;
        const { variantId } = req.params;

        const color = await Color.create({ name, price, hexCode });

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
// @route   GET /api/variants/:variantId/colors
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