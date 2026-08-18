const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'userId is required'],
      trim: true,
      index: true,
    },
    reelId: {
      type: String,
      required: [true, 'reelId is required'],
      trim: true,
      index: true,
    },
    interactionType: {
      type: String,
      required: [true, 'interactionType is required'],
      enum: {
        values: ['VIEW', 'LIKE', 'SAVE', 'SHARE', 'SKIP'],
        message: '{VALUE} is not a valid interactionType. Must be VIEW, LIKE, SAVE, SHARE, or SKIP',
      },
    },
    watchDuration: {
      type: Number,
      default: 0,
      min: [0, 'watchDuration cannot be negative'],
    },
    completionRate: {
      type: Number,
      default: 0,
      min: [0, 'completionRate cannot be less than 0'],
      max: [1, 'completionRate cannot be greater than 1 (0.0 to 1.0)'],
    },
    liked: {
      type: Boolean,
      default: false,
    },
    saved: {
      type: Boolean,
      default: false,
    },
    shared: {
      type: Boolean,
      default: false,
    },
    skipped: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Compound index for user query filtering and chronological timeline
interactionSchema.index({ userId: 1, timestamp: -1 });
interactionSchema.index({ userId: 1, reelId: 1 });

module.exports = mongoose.model('Interaction', interactionSchema);
