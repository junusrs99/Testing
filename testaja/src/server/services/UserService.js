const User = require('../models/User');
const EncryptionUtil = require('../utils/encryption');
const ErrorCodes = require('../constants/errorCodes');

// Mock user storage (replace with database in production)
const users = [];

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} Created user
   */
  async createUser(userData) {
    const { email, password, name } = userData;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      const error = new Error(ErrorCodes.USER_ALREADY_EXISTS.message);
      error.code = ErrorCodes.USER_ALREADY_EXISTS.code;
      error.statusCode = ErrorCodes.USER_ALREADY_EXISTS.statusCode;
      throw error;
    }

    // Hash password
    const hashedPassword = await EncryptionUtil.hashPassword(password);

    // Create user
    const user = new User({
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    });

    users.push(user);
    return user;
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} User or null
   */
  async findByEmail(email) {
    const user = users.find(u => u.email === email);
    return user ? new User(user) : null;
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<User|null>} User or null
   */
  async findById(id) {
    const user = users.find(u => u.id === id);
    return user ? new User(user) : null;
  }

  /**
   * Verify user credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<User>} User if credentials are valid
   */
  async verifyCredentials(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      const error = new Error(ErrorCodes.USER_INVALID_CREDENTIALS.message);
      error.code = ErrorCodes.USER_INVALID_CREDENTIALS.code;
      error.statusCode = ErrorCodes.USER_INVALID_CREDENTIALS.statusCode;
      throw error;
    }

    const isValid = await EncryptionUtil.comparePassword(password, user.password);
    if (!isValid) {
      const error = new Error(ErrorCodes.USER_INVALID_CREDENTIALS.message);
      error.code = ErrorCodes.USER_INVALID_CREDENTIALS.code;
      error.statusCode = ErrorCodes.USER_INVALID_CREDENTIALS.statusCode;
      throw error;
    }

    return user;
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<User>} Updated user
   */
  async updateUser(id, updateData) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      const error = new Error(ErrorCodes.USER_NOT_FOUND.message);
      error.code = ErrorCodes.USER_NOT_FOUND.code;
      error.statusCode = ErrorCodes.USER_NOT_FOUND.statusCode;
      throw error;
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return new User(users[userIndex]);
  }
}

module.exports = new UserService();

