const express = require('express');
const router = express.Router();
const { generateRecommendation } = require('../controllers/recommendationController');

// POST & GET /api/recommendations/generate/:userId
router.post('/generate/:userId', generateRecommendation);
router.get('/generate/:userId', generateRecommendation);

module.exports = router;
