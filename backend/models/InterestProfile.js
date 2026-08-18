const mongoose = require('mongoose');

const interestItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    evidence: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    relatedTopics: {
      type: [String],
      default: [],
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8,
    },
    reasoning: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const interestProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    primaryInterest: {
      type: String,
      required: true,
      trim: true,
    },
    interests: [interestItemSchema],
    supportingTopics: {
      type: [String],
      default: [],
    },
    evidence: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    dominanceFactor: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.2, // Low = broad/diverse, High = single-topic dominant
    },
    reasoning: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model('InterestProfile', interestProfileSchema);
