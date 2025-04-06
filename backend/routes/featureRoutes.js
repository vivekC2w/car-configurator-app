const express = require('express');
const {
  addFeature,
  getFeatures
} = require('../controllers/featureController');
const upload = require('../middleware/upload');

const router = express.Router();

const featureUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

router.route('/')
  .post(featureUpload, addFeature);

router.route('/:variantId/features')
  .get(getFeatures);

module.exports = router;