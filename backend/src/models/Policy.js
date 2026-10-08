import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true }
}, { timestamps: true });

export const Policy = mongoose.models.Policy || mongoose.model('Policy', policySchema);
export default Policy;
