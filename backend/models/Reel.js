const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema(
  {
    reelId: {
      type: String,
      required: [true, 'reelId is required'],
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    transcript: {
      type: String,
      default: '',
      trim: true,
    },
    creator: {
      type: String,
      default: 'Anonymous Creator',
      trim: true,
    },
    platform: {
      type: String,
      default: 'Shorts',
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'url is required'],
      trim: true,
    },
    duration: {
      type: Number,
      default: 0,
      min: [0, 'duration cannot be negative'],
    },
    topics: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'Technology',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    technicalDepth: {
      type: Number,
      default: 5,
      min: [1, 'technicalDepth must be between 1 and 10'],
      max: [10, 'technicalDepth must be between 1 and 10'],
    },
    entertainmentLevel: {
      type: Number,
      default: 5,
      min: [1, 'entertainmentLevel must be between 1 and 10'],
      max: [10, 'entertainmentLevel must be between 1 and 10'],
    },
    educationalValue: {
      type: Number,
      default: 5,
      min: [1, 'educationalValue must be between 1 and 10'],
      max: [10, 'educationalValue must be between 1 and 10'],
    },
    careerValue: {
      type: Number,
      default: 5,
      min: [1, 'careerValue must be between 1 and 10'],
      max: [10, 'careerValue must be between 1 and 10'],
    },
    hypeScore: {
      type: Number,
      default: 5,
      min: [1, 'hypeScore must be between 1 and 10'],
      max: [10, 'hypeScore must be between 1 and 10'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Indexes for query optimization
reelSchema.index({ category: 1 });
reelSchema.index({ topics: 1 });
reelSchema.index({ educationalValue: -1, technicalDepth: -1 });

module.exports = mongoose.model('Reel', reelSchema);
