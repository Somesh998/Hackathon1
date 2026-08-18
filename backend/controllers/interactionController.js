const mongoose = require('mongoose');
const Interaction = require('../models/Interaction');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// In-memory interactions store for decoupled development fallback
const inMemoryInteractions = [];

/**
 * POST /api/interactions
 * Record a user interaction on a reel
 */
const recordInteraction = async (req, res) => {
  try {
    const {
      userId,
      reelId,
      interactionType,
      watchDuration = 0,
      completionRate = 0,
      liked,
      saved,
      shared,
      skipped,
      timestamp,
    } = req.body;

    const interactionPayload = {
      userId,
      reelId,
      interactionType,
      watchDuration,
      completionRate,
      liked: liked !== undefined ? liked : interactionType === 'LIKE',
      saved: saved !== undefined ? saved : interactionType === 'SAVE',
      shared: shared !== undefined ? shared : interactionType === 'SHARE',
      skipped: skipped !== undefined ? skipped : interactionType === 'SKIP',
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    };

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const interaction = new Interaction(interactionPayload);
      const savedDoc = await interaction.save();
      return sendSuccess(res, 'Interaction recorded successfully in database', savedDoc, 201);
    }

    // In-memory fallback
    const mockDoc = {
      _id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...interactionPayload,
    };
    inMemoryInteractions.push(mockDoc);

    return sendSuccess(
      res,
      'Interaction recorded successfully (in-memory store)',
      mockDoc,
      201
    );
  } catch (error) {
    console.error('Error in recordInteraction:', error);
    return sendError(res, 'Failed to record interaction', error, 500);
  }
};

/**
 * GET /api/interactions/user/:userId
 * Retrieve all interaction history for a given user
 */
const getUserInteractions = async (req, res) => {
  try {
    const { userId } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const interactions = await Interaction.find({ userId })
        .sort({ timestamp: -1 })
        .limit(100);

      return sendSuccess(
        res,
        `Retrieved ${interactions.length} interactions for user '${userId}'`,
        interactions
      );
    }

    // In-memory search
    const userInteractions = inMemoryInteractions
      .filter((i) => i.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return sendSuccess(
      res,
      `Retrieved ${userInteractions.length} interactions for user '${userId}' (in-memory store)`,
      userInteractions
    );
  } catch (error) {
    console.error('Error in getUserInteractions:', error);
    return sendError(res, 'Failed to fetch user interactions', error, 500);
  }
};

module.exports = {
  recordInteraction,
  getUserInteractions,
};
