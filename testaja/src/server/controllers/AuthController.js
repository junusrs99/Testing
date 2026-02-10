const UserService = require('../services/UserService');
const JWTUtil = require('../utils/jwt');
const ResponseHelper = require('../utils/response');
const ErrorCodes = require('../constants/errorCodes');

class AuthController {
  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      const user = await UserService.createUser({ email, password, name });
      const token = JWTUtil.generateToken({ userId: user.id, email: user.email });

      return ResponseHelper.success(res, {
        token,
        user: user.toPublicJSON()
      }, 'User registered successfully', 201);
    } catch (error) {
      return ResponseHelper.error(res, error, error.statusCode || 500);
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserService.verifyCredentials(email, password);
      const token = JWTUtil.generateToken({ userId: user.id, email: user.email });

      return ResponseHelper.success(res, {
        token,
        user: user.toPublicJSON()
      }, 'Login successful');
    } catch (error) {
      return ResponseHelper.error(res, error, error.statusCode || 401);
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req, res) {
    try {
      const user = await UserService.findById(req.user.userId);
      if (!user) {
        return ResponseHelper.notFound(res, 'User');
      }

      return ResponseHelper.success(res, user.toPublicJSON());
    } catch (error) {
      return ResponseHelper.error(res, error, error.statusCode || 500);
    }
  }
}

module.exports = new AuthController();

