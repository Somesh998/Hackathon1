const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const reelRoutes = require('./reelRoutes');
const interactionRoutes = require('./interactionRoutes');
const interestRoutes = require('./interestRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const evaluationRoutes = require('./evaluationRoutes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/reels', reelRoutes);
router.use('/interactions', interactionRoutes);
router.use('/interests', interestRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/evaluation', evaluationRoutes);

module.exports = router;
