const express = require('express');
const router = express.Router();
const {
  createConfiguration,
  getConfigurationById,
  getAllConfigurations,
  updateConfiguration,
  deleteConfiguration
} = require('../controllers/configurationController');

router.post('/', createConfiguration);

router.get('/', getAllConfigurations);

router.get('/:id', getConfigurationById);

router.put('/:id', updateConfiguration);

router.delete('/:id', deleteConfiguration);

module.exports = router;