const express = require('express');
const router = express.Router();
const { recordInteraction, getUserInteractions } = require('../controllers/interactionController');
const { validateInteractionCreation } = require('../middleware/validation');

// POST /api/interactions - Record a new interaction
router.post('/', validateInteractionCreation, recordInteraction);

// GET /api/interactions/user/:userId - Retrieve interactions for a student
router.get('/user/:userId', getUserInteractions);

module.exports = router;
