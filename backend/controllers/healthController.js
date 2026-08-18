/**
 * Controller to verify server health and API availability
 * GET /api/health
 */
const getHealthStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Recommendation Agent API is running"
  });
};

module.exports = {
  getHealthStatus,
};
