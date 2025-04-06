const express = require('express');
const router = express.Router();
const { createAccessory, getAccessories, getAccessoryById, deleteAccessory } = require('../controllers/accessoryController');

const upload = require('../middleware/upload');

router.route('/').post(upload.single('image'), createAccessory).get(getAccessories);

router.route('/:id').get(getAccessoryById);

router.route('/:id')
  .delete(deleteAccessory);

module.exports = router;