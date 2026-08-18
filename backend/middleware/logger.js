const morgan = require('morgan');

// Custom logging format for API requests
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms');

module.exports = requestLogger;
