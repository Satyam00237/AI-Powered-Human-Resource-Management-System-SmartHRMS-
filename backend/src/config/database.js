import mongoose from 'mongoose';
import dns from 'dns';
import config from './env.js';
import { getDefaultSeedData } from './seedData.js';
import {
  Employee,
  Attendance,
  Leave,
  Job,
  Candidate,
  Policy
} from '../models/index.js';

// Force DNS resolution to prefer IPv4 (fixes MongoDB Atlas connection issues on IPv6 networks)
dns.setDefaultResultOrder('ipv4first');

// Global cache for serverless environments (Vercel)
let cachedConnection = global.mongoose;
if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

function resetConnectionCache() {
  cachedConnection.conn = null;
  cachedConnection.promise = null;
}

export const databaseStatus = {
  isMongoConnected: false,
  connectionError: null,
  _initPromise: null
};

async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    cachedConnection.conn = mongoose.connection;
    databaseStatus.isMongoConnected = true;
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      family: 4
    })
      .then((mongooseInstance) => {
        cachedConnection.conn = mongooseInstance.connection;
        databaseStatus.isMongoConnected = true;
        databaseStatus.connectionError = null;
        return cachedConnection.conn;
      })
      .catch((err) => {
        resetConnectionCache();
        databaseStatus.isMongoConnected = false;
        databaseStatus.connectionError = err.message || String(err);
        throw err;
      });
  }

  return cachedConnection.promise;
}

export async function seedIfEmpty() {
  try {
    const empCount = await Employee.countDocuments();
    if (empCount > 0) return;

    console.log('MongoDB is empty — seeding demo data...');
    const seed = getDefaultSeedData();

    if (seed.employees?.length) await Employee.insertMany(seed.employees);
    if (seed.attendance?.length) await Attendance.insertMany(seed.attendance);
    if (seed.leaves?.length) await Leave.insertMany(seed.leaves);
    if (seed.jobs?.length) await Job.insertMany(seed.jobs);
    if (seed.candidates?.length) await Candidate.insertMany(seed.candidates);
    if (seed.policies?.length) await Policy.insertMany(seed.policies);

    console.log('Demo data seeded successfully.');
  } catch (err) {
    console.error('Failed to seed database:', err);
  }
}

export async function connectDatabase() {
  if (!config.MONGODB_URI) {
    databaseStatus.connectionError = 'MONGODB_URI environment variable is not configured.';
    console.error(databaseStatus.connectionError);
    return false;
  }

  try {
    console.log('Connecting to MongoDB...');
    await connectMongo();
    console.log('MongoDB connected successfully.');
    databaseStatus.isMongoConnected = true;
    databaseStatus.connectionError = null;
    await seedIfEmpty();
    return true;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    databaseStatus.isMongoConnected = false;
    databaseStatus.connectionError = err.message || String(err);
    return false;
  }
}

export async function ensureConnected() {
  if (databaseStatus.isMongoConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  if (!databaseStatus._initPromise) {
    databaseStatus._initPromise = connectDatabase().finally(() => {
      if (!databaseStatus.isMongoConnected) {
        databaseStatus._initPromise = null;
        resetConnectionCache();
      }
    });
  }

  await databaseStatus._initPromise;
  return databaseStatus.isMongoConnected;
}

export default {
  connectDatabase,
  ensureConnected,
  seedIfEmpty,
  databaseStatus
};
