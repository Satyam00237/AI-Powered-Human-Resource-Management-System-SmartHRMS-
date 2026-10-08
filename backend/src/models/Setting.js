import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true }
}, { timestamps: true });

export const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
export default Setting;
