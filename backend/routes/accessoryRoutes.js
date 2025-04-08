const express = require('express');
const router = express.Router();
const { createAccessory, getAccessories, getAccessoriesByVariantId, getAccessoryById, deleteAccessory } = require('../controllers/accessoryController');

const upload = require('../middleware/upload');

router.route('/').post(upload.single('image'), createAccessory).get(getAccessories);

router.route('/:id').get(getAccessoryById).delete(deleteAccessory);

router.route('/variant/:variantId').get(getAccessoriesByVariantId);

module.exports = router;