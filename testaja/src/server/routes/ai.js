const express = require('express');
const router = express.Router();
const AIController = require('../controllers/AIController');
const { optionalAuth } = require('../middleware/auth');

// Get AI insights and recommendations (public with optional auth)
router.get('/insights', optionalAuth, AIController.getInsights.bind(AIController));

// Get personalized financial twin data (public with optional auth)
router.get('/financial-twin', optionalAuth, AIController.getFinancialTwin.bind(AIController));

// Get credit recommendations (public with optional auth)
router.get('/credit-recommendations', optionalAuth, AIController.getCreditRecommendations?.bind(AIController) || ((req, res) => res.json({ data: [] })));

module.exports = router;

