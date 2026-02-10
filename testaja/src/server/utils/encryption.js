const bcrypt = require('bcryptjs');
const { config } = require('../config/config');

class EncryptionUtil {
  /**
   * Hash a password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(config.security.bcryptRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Error hashing password');
    }
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} True if passwords match
   */
  static async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  }

  /**
   * Generate a random token
   * @param {number} length - Token length
   * @returns {string} Random token
   */
  static generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}

module.exports = EncryptionUtil;

