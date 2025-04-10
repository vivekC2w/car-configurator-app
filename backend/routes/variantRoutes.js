const express = require('express');
const { createVariant, getVariant, deleteVariantsByModel, deleteVariant, searchVariants } = require('../controllers/variantController');

const router = express.Router();

router.get('/search', searchVariants);

router.route('/').post(createVariant);

router.route('/:id').get(getVariant).delete(deleteVariant);

router.route('/model/:modelId').delete(deleteVariantsByModel);

module.exports = router;