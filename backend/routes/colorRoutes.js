const express = require('express');
const { addColor, getColors, deleteColor } = require('../controllers/colorController');

const router = express.Router();

router.route('/:variantId/colors').post(addColor).get(getColors);

router.route('/:colorId').delete(deleteColor);

module.exports = router;
// Compare this snippet from car-configurator-app/backend/controllers/colorController.js: