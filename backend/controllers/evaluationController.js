const evaluationFramework = require('../services/evaluation/evaluationFramework');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * GET /api/evaluation/benchmark
 * Runs complete comparative evaluation across all 10 student interaction personas
 */
const getBenchmarkReport = async (req, res) => {
  try {
    const report = await evaluationFramework.runCompleteEvaluation();
    return sendSuccess(
      res,
      'Evaluation benchmark report generated successfully (Baseline vs AI System)',
      report
    );
  } catch (error) {
    console.error('Error in getBenchmarkReport:', error);
    return sendError(res, 'Failed to generate evaluation report', error, 500);
  }
};

module.exports = {
  getBenchmarkReport,
};
