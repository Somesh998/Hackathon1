const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Interaction = require('../models/Interaction');
const scoringService = require('../services/interest/scoringService');

const simulateBehavior = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_tech_recommender';
  console.log(`[Simulation] Connecting to MongoDB at ${mongoURI}...`);

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Simulation] MongoDB Connected.');

    const userId = 'student_tech_curious_01';

    // Clear previous simulated interactions for this student
    await Interaction.deleteMany({ userId });

    const simulatedEvents = [
      {
        userId,
        reelId: 'reel_java_meme_01',
        interactionType: 'LIKE',
        watchDuration: 22,
        completionRate: 1.0,
        liked: true,
        saved: false,
        shared: false,
        skipped: false,
        timestamp: new Date(Date.now() - 3600000 * 4), // 4 hours ago
      },
      {
        userId,
        reelId: 'reel_swe_lifestyle_02',
        interactionType: 'SAVE',
        watchDuration: 35,
        completionRate: 1.0,
        liked: false,
        saved: true,
        shared: false,
        skipped: false,
        timestamp: new Date(Date.now() - 3600000 * 3), // 3 hours ago
      },
      {
        userId,
        reelId: 'reel_coding_interview_03',
        interactionType: 'LIKE',
        watchDuration: 28,
        completionRate: 0.95,
        liked: true,
        saved: false,
        shared: false,
        skipped: false,
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      },
      {
        userId,
        reelId: 'reel_laptop_comparison_04',
        interactionType: 'SHARE',
        watchDuration: 48,
        completionRate: 1.0,
        liked: true,
        saved: true,
        shared: true,
        skipped: false,
        timestamp: new Date(Date.now() - 3600000 * 1), // 1 hour ago
      },
      {
        userId,
        reelId: 'reel_gaming_unreal_05',
        interactionType: 'SKIP',
        watchDuration: 3,
        completionRate: 0.08,
        liked: false,
        saved: false,
        shared: false,
        skipped: true,
        timestamp: new Date(), // Just now
      },
    ];

    console.log(`[Simulation] Inserting ${simulatedEvents.length} behavioral interaction events...`);
    await Interaction.insertMany(simulatedEvents);
    console.log('[Simulation] ✅ Successfully seeded student interaction stream.\n');

    // Run scoring service calculation to preview evidence
    const evidenceReport = await scoringService.extractUserInterestEvidence(userId);
    console.log('--- 📊 Extracted Interest Evidence Report ---');
    console.log(`Student ID: ${evidenceReport.userId}`);
    console.log(`Total Events: ${evidenceReport.totalInteractions}`);
    console.log('\nTop Evidence Items:');
    evidenceReport.strongestEvidence.forEach((item, idx) => {
      console.log(
        `  ${idx + 1}. [${item.reelId}] ${item.title}` +
        `\n     Category: ${item.category} | Level: ${item.evidenceLevel} | Strength: ${item.evidenceStrength}` +
        `\n     Signals -> Completion: ${Math.round(item.signals.avgCompletionRate * 100)}% | Likes: ${item.signals.likes} | Saves: ${item.signals.saves} | Shares: ${item.signals.shares} | Skips: ${item.signals.skips}`
      );
    });

    console.log('\nTop Inferred Topic Affinities:');
    evidenceReport.topTopicAffinities.slice(0, 6).forEach((top) => {
      console.log(`  - #${top.topic}: ${top.score}`);
    });
    console.log('--------------------------------------------\n');

    await mongoose.disconnect();
    console.log('[Simulation] Complete.');
    process.exit(0);
  } catch (error) {
    console.error(`[Simulation] ❌ Error: ${error.message}`);
    process.exit(1);
  }
};

simulateBehavior();
