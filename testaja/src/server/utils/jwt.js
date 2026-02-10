const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

class JWTUtil {
  /**
   * Generate JWT token
   * @param {Object} payload - Token payload
   * @param {string} expiresIn - Token expiration time
   * @returns {string} JWT token
   */
  static generateToken(payload, expiresIn = config.jwt.expiresIn) {
    return jwt.sign(payload, config.jwt.secret, { expiresIn });
  }

  /**
   * Generate refresh token
   * @param {Object} payload - Token payload
   * @returns {string} Refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.refreshExpiresIn });
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Decode token without verification
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTUtil;

