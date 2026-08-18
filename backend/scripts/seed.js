const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Reel = require('../models/Reel');

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_tech_recommender';
  console.log(`[Seed] Connecting to MongoDB at ${mongoURI}...`);

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[Seed] MongoDB Connected successfully.');

    // Load sample data
    const dataPath = path.resolve(__dirname, '../../data/sample-reels.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const sampleReels = JSON.parse(rawData);

    console.log(`[Seed] Found ${sampleReels.length} sample reels in sample-reels.json.`);

    // Clear existing sample reels or upsert
    let insertedCount = 0;
    for (const item of sampleReels) {
      await Reel.findOneAndUpdate(
        { reelId: item.reelId },
        { $set: item },
        { upsert: true, new: true, runValidators: true }
      );
      insertedCount++;
    }

    console.log(`[Seed] ✅ Successfully seeded ${insertedCount} reels into MongoDB collection 'reels'.`);

    // Display summary table
    const storedReels = await Reel.find({}, 'reelId title category difficulty educationalValue technicalDepth');
    console.log('\n--- Seeded Reels Summary ---');
    storedReels.forEach((r, idx) => {
      console.log(`${idx + 1}. [${r.reelId}] ${r.title} | Category: ${r.category} | Edu: ${r.educationalValue}/10 | Tech: ${r.technicalDepth}/10`);
    });
    console.log('----------------------------\n');

    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB. Seed complete.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] ❌ Seeding error: ${error.message}`);
    if (error.name === 'MongooseServerSelectionError') {
      console.warn('[Seed] Note: If local MongoDB service is not currently active, start MongoDB and run `npm run seed`.');
    }
    process.exit(1);
  }
};

seedDatabase();
