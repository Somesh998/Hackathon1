const express = require('express');
const router = express.Router();
const {
  createReel,
  getAllReels,
  getReelById,
  analyzeReelPayload,
  analyzeStoredReel,
} = require('../controllers/reelController');
const { validateReelCreation } = require('../middleware/validation');

// POST /api/reels/analyze - Analyze on-demand reel payload
router.post('/analyze', analyzeReelPayload);

// POST /api/reels/:id/analyze - Analyze specific stored reel
router.post('/:id/analyze', analyzeStoredReel);

// POST /api/reels - Create a new reel
router.post('/', validateReelCreation, createReel);

// GET /api/reels - List all reels
router.get('/', getAllReels);

// GET /api/reels/:id - Get reel by reelId or ObjectId
router.get('/:id', getReelById);

module.exports = router;
