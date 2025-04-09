const express = require('express');
const { createModel, uploadModelImage, getModels, getModel, getModelVariants, getModelByName, searchModels } = require('../controllers/modelController');

const router = express.Router();

router.route('/').post(uploadModelImage, createModel).get(getModels);
router.route('/:id').get(getModel);
router.route('/:id/variants').get(getModelVariants);
router.route('/name/:name').get(getModelByName);
router.route('/search').get(searchModels);

module.exports = router;