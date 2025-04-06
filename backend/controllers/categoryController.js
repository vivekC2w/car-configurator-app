const Category = require('../models/Category');

// @desc Get all categories
// @route GET /api/categories
// @access Public
exports.getCategories = async (req, res) => {
  try {
    // Optional filtering by type
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
  } catch (error) {
    res.status(500).json({ 
        success: false,
        message: 'Server error' 
    });
  }
};

// @desc Create a category
// @route POST /api/categories
// @access Private
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            data: category,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}

// @desc Update a category
// @route PUT /api/categories/:id
// @access Public 
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc Delete a category
// @route DELETE /api/categories/:id
// @access Public
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};