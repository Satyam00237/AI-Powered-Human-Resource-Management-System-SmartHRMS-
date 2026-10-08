import { Setting } from '../models/Setting.js';
import config from '../config/env.js';
import { ensureConnected, databaseStatus } from '../config/database.js';

export const hasGeminiKey = async (req, res) => {
  try {
    let dbKey = '';
    const setting = await Setting.findOne({ key: 'geminiKey' }).lean();
    if (setting) dbKey = setting.value;

    const hasKey = !!(config.GEMINI_API_KEY || dbKey);
    res.json({ hasKey });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve settings status' });
  }
};

export const updateGeminiKey = async (req, res) => {
  try {
    const { geminiKey } = req.body;
    await Setting.findOneAndUpdate(
      { key: 'geminiKey' },
      { value: geminiKey || '' },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Gemini API key updated on server.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update Gemini API key' });
  }
};

export const getDbStatus = async (req, res) => {
  await ensureConnected();
  res.json({
    isMongoConnected: databaseStatus.isMongoConnected,
    connectionError: databaseStatus.connectionError,
    hasMongoUri: !!config.MONGODB_URI,
    mongoUriPrefix: config.MONGODB_URI ? config.MONGODB_URI.substring(0, 30) : 'none'
  });
};

export default {
  hasGeminiKey,
  updateGeminiKey,
  getDbStatus
};
