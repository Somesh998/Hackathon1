const mongoose = require('mongoose');

const evidenceItemSchema = new mongoose.Schema(
  {
    reelId: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    signal: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const interestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    broaderInterest: {
      type: String, // e.g. "Software Engineering / Technology"
      required: true,
      trim: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8,
    },
    evidence: [evidenceItemSchema],
    inferredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interest', interestSchema);
