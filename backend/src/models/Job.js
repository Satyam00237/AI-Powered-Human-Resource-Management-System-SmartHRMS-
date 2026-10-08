import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  type: { type: String, required: true }, // 'Full-time', 'Part-time', etc.
  location: { type: String, required: true },
  status: { type: String, default: 'Open' }, // 'Open', 'Closed'
  description: { type: String, required: true },
  candidatesCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
