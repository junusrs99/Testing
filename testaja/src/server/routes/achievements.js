const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const ResponseHelper = require('../utils/response');

// Mock achievements data
const getDefaultAchievements = () => [
  {
    _id: '1',
    name: 'First Steps',
    description: 'Complete your profile setup',
    category: 'onboarding',
    points: 50,
    rarity: 'common',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    name: 'Savings Starter',
    description: 'Save your first $1,000',
    category: 'savings',
    points: 100,
    rarity: 'common',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    name: 'Debt Destroyer',
    description: 'Pay off your first debt',
    category: 'debt',
    points: 200,
    rarity: 'rare',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    name: 'Credit Champion',
    description: 'Achieve a credit score of 750+',
    category: 'credit',
    points: 300,
    rarity: 'rare',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    name: 'Millionaire Mindset',
    description: 'Reach $100,000 in net worth',
    category: 'savings',
    points: 500,
    rarity: 'epic',
    unlocked: false,
    progress: 125430,
    target: 100000,
  },
  {
    _id: '6',
    name: 'Investment Guru',
    description: 'Invest $50,000 in portfolio',
    category: 'investment',
    points: 400,
    rarity: 'epic',
    unlocked: false,
    progress: 125430,
    target: 50000,
  },
  {
    _id: '7',
    name: 'Perfect Payment',
    description: 'Make 12 consecutive on-time payments',
    category: 'credit',
    points: 250,
    rarity: 'rare',
    unlocked: false,
    progress: 8,
    target: 12,
  },
];

const getDefaultStats = () => ({
  totalAchievements: 7,
  unlocked: 4,
  totalPoints: 650,
  level: 5,
  currentPoints: 650,
  pointsNeeded: 1000,
});

// Get all achievements (public with optional auth)
router.get('/', optionalAuth, (req, res) => {
  try {
    return ResponseHelper.success(res, getDefaultAchievements());
  } catch (error) {
    return ResponseHelper.error(res, error);
  }
});

// Get achievement stats (public with optional auth)
router.get('/stats', optionalAuth, (req, res) => {
  try {
    return ResponseHelper.success(res, getDefaultStats());
  } catch (error) {
    return ResponseHelper.error(res, error);
  }
});

module.exports = router;

