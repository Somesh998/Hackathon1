const mongoose = require('mongoose');

/**
 * Connect to MongoDB database instance.
 * Gracefully handles scenarios where MongoDB is optional during initial setup.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_tech_recommender';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000, // Timeout after 3 seconds if local MongoDB is not running
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] MongoDB connection notice: ${error.message}`);
    console.warn('[Database] Running in decoupled mode without active MongoDB connection (Health check and in-memory workflows remain functional).');
    return null;
  }
};

module.exports = connectDB;
