const express = require('express');
const { createModel, uploadModelImage, getModels, getModel, getModelVariants } = require('../controllers/modelController');

const router = express.Router();

router.route('/').post(uploadModelImage, createModel).get(getModels);
router.route('/:id').get(getModel);
router.route('/:id/variants').get(getModelVariants);

module.exports = router;