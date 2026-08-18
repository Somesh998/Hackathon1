const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema(
  {
    reelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reel',
    },
    rawReelId: {
      type: String, // Reference ID from seed/sample data
    },
    action: {
      type: String,
      enum: ['viewed', 'liked', 'saved', 'shared', 'completed', 'skipped'],
      default: 'viewed',
    },
    watchTimeSeconds: {
      type: Number,
      default: 0,
    },
    interactedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    interactions: [interactionSchema],
    inferredInterests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
