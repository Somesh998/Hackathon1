/**
 * Standardized API response utilities
 */
const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  const payload = {
    success: true,
    message,
  };

  if (data !== null) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

const sendError = (res, message = 'Internal Server Error', error = null, statusCode = 500) => {
  const payload = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development' && error) {
    payload.error = typeof error === 'string' ? error : error.message || error;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError,
};
