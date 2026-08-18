const express = require('express');
const router = express.Router();
const {
  getStudentInterestProfile,
  triggerInterestInference,
  getStudentInterestEvidence,
  getStudentRecommendations,
} = require('../controllers/interestController');

// GET /api/interests/evidence/:userId - Behavioral evidence stream
router.get('/evidence/:userId', getStudentInterestEvidence);

// GET /api/interests/recommendations/:userId - Personalized recommendations
router.get('/recommendations/:userId', getStudentRecommendations);

// POST /api/interests/infer/:userId - Force trigger inference
router.post('/infer/:userId', triggerInterestInference);

// GET /api/interests/:userId - Inferred interest profile
router.get('/:userId', getStudentInterestProfile);

module.exports = router;
