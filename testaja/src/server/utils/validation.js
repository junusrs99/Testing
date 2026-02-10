const { body, validationResult } = require('express-validator');

// Validation rules
const ValidationRules = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  name: body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  amount: body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),

  date: body('date')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format'),

  category: body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Income', 'Housing', 'Groceries', 'Dining', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Other'])
    .withMessage('Invalid category')
};

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: errors.array()
      }
    });
  }
  next();
};

module.exports = {
  ValidationRules,
  validate
};

