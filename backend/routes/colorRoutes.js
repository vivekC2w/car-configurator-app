const express = require('express');
const { addColor, getColors, deleteColor, addMultipleColors } = require('../controllers/colorController');

const router = express.Router();

router.route('/:variantId/colors').post(addColor).get(getColors);

router.route('/:colorId').delete(deleteColor);

router.post('/:variantId/colors/bulk', addMultipleColors);

module.exports = router;