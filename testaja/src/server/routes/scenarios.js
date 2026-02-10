const express = require('express');
const router = express.Router();
const ScenarioController = require('../controllers/ScenarioController');
const { optionalAuth } = require('../middleware/auth');

// Simulate financial scenarios (public with optional auth)
router.post('/simulate', optionalAuth, ScenarioController.simulate.bind(ScenarioController));

// Get available scenario types (public with optional auth)
router.get('/types', optionalAuth, ScenarioController.getTypes.bind(ScenarioController));

module.exports = router;

