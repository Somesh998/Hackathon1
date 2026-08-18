const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Reel = require('../models/Reel');
const aiService = require('../services/ai');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Local fallback loader if MongoDB is not actively connected
const getLocalSampleReels = () => {
  try {
    const dataPath = path.resolve(__dirname, '../../data/sample-reels.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading local sample-reels.json:', err);
    return [];
  }
};

/**
 * POST /api/reels
 * Create a new Reel record
 */
const createReel = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      return sendError(
        res,
        'Database is currently disconnected. Cannot persist new reel to MongoDB.',
        null,
        503
      );
    }

    const existingReel = await Reel.findOne({ reelId: req.body.reelId });
    if (existingReel) {
      return sendError(
        res,
        `Reel with reelId '${req.body.reelId}' already exists.`,
        null,
        409
      );
    }

    const newReel = new Reel(req.body);
    const savedReel = await newReel.save();

    return sendSuccess(res, 'Reel created successfully', savedReel, 201);
  } catch (error) {
    console.error('Error in createReel:', error);
    return sendError(res, 'Failed to create reel', error, 500);
  }
};

/**
 * GET /api/reels
 * Retrieve all reels with optional category/topic filtering
 */
const getAllReels = async (req, res) => {
  try {
    const { category, topic, limit = 50 } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const filter = {};
      if (category) filter.category = new RegExp(category, 'i');
      if (topic) filter.topics = { $in: [new RegExp(topic, 'i')] };

      const reels = await Reel.find(filter).limit(Number(limit)).sort({ createdAt: -1 });

      if (reels.length > 0) {
        return sendSuccess(res, 'Reels fetched successfully from database', reels);
      }
    }

    // Local fallback
    let sampleReels = getLocalSampleReels();
    if (category) {
      sampleReels = sampleReels.filter((r) =>
        r.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (topic) {
      sampleReels = sampleReels.filter((r) =>
        r.topics.some((t) => t.toLowerCase().includes(topic.toLowerCase()))
      );
    }

    return sendSuccess(
      res,
      'Reels fetched successfully (sample seed data)',
      sampleReels
    );
  } catch (error) {
    console.error('Error in getAllReels:', error);
    return sendError(res, 'Failed to fetch reels', error, 500);
  }
};

/**
 * GET /api/reels/:id
 * Retrieve a specific reel by reelId or MongoDB _id
 */
const getReelById = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let reel = await Reel.findOne({ reelId: id });
      if (!reel && mongoose.Types.ObjectId.isValid(id)) {
        reel = await Reel.findById(id);
      }

      if (reel) {
        return sendSuccess(res, 'Reel found', reel);
      }
    }

    // Local fallback search
    const sampleReels = getLocalSampleReels();
    const found = sampleReels.find((r) => r.reelId === id || r.id === id);

    if (found) {
      return sendSuccess(res, 'Reel found (from sample dataset)', found);
    }

    return sendError(res, `Reel with id '${id}' not found.`, null, 404);
  } catch (error) {
    console.error('Error in getReelById:', error);
    return sendError(res, 'Failed to retrieve reel', error, 500);
  }
};

/**
 * POST /api/reels/analyze
 * On-demand AI semantic analysis for any provided reel payload
 */
const analyzeReelPayload = async (req, res) => {
  try {
    const reelData = req.body;
    if (!reelData || !reelData.title) {
      return sendError(res, 'A valid reel object with at least a title is required for analysis.', null, 400);
    }

    const analysis = await aiService.analyzeReel(reelData);
    return sendSuccess(res, 'Semantic AI analysis completed successfully', analysis);
  } catch (error) {
    console.error('Error in analyzeReelPayload:', error);
    return sendError(res, `AI analysis failed: ${error.message}`, error, 500);
  }
};

/**
 * POST /api/reels/:id/analyze
 * Run AI semantic analysis on an existing stored reel and persist result
 */
const analyzeStoredReel = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    let targetReel = null;
    if (isDbConnected) {
      targetReel = await Reel.findOne({ reelId: id });
      if (!targetReel && mongoose.Types.ObjectId.isValid(id)) {
        targetReel = await Reel.findById(id);
      }
    }

    if (!targetReel) {
      const sampleReels = getLocalSampleReels();
      targetReel = sampleReels.find((r) => r.reelId === id || r.id === id);
    }

    if (!targetReel) {
      return sendError(res, `Reel with id '${id}' not found.`, null, 404);
    }

    const analysis = await aiService.analyzeReel(targetReel);

    return sendSuccess(
      res,
      `Semantic AI analysis completed for reel '${targetReel.reelId || id}'`,
      {
        reelId: targetReel.reelId,
        title: targetReel.title,
        analysis,
      }
    );
  } catch (error) {
    console.error('Error in analyzeStoredReel:', error);
    return sendError(res, `Failed to analyze reel '${req.params.id}': ${error.message}`, error, 500);
  }
};

module.exports = {
  createReel,
  getAllReels,
  getReelById,
  analyzeReelPayload,
  analyzeStoredReel,
};
