const express = require('express');
const router = express.Router();
const { getBenchmarkReport } = require('../controllers/evaluationController');

// GET /api/evaluation/benchmark
router.get('/benchmark', getBenchmarkReport);

module.exports = router;
