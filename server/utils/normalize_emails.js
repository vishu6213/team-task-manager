import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from './db.js';

dotenv.config();

const normalizeEmails = async () => {
  try {
    await connectDB();

    const users = await User.find({});
    console.log(`Found ${users.length} users to check.`);

    let updatedCount = 0;
    for (const user of users) {
      const normalized = user.email.trim().toLowerCase();
      if (user.email !== normalized) {
        user.email = normalized;
        await user.save();
        updatedCount++;
      }
    }

    console.log(`Successfully normalized ${updatedCount} user emails.`);
    process.exit(0);
  } catch (error) {
    console.error(`Error during normalization: ${error.message}`);
    process.exit(1);
  }
};

normalizeEmails();
