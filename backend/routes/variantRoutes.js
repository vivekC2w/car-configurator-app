const express = require('express');
const { createVariant, getVariant, deleteVariantsByModel, deleteVariant, searchVariants } = require('../controllers/variantController');

const router = express.Router();

router.route('/').post(createVariant);

router.route('/:id').get(getVariant).delete(deleteVariant);

router.route('/model/:modelId').delete(deleteVariantsByModel);

router.route('/search').get(searchVariants);

module.exports = router;