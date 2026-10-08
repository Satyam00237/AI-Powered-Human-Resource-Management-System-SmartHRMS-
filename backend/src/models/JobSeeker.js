import mongoose from 'mongoose';

const jobSeekerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  skills: { type: String, default: '' },
  education: { type: String, default: '' },
  experience: { type: String, default: '' },
  resumeText: { type: String, default: '' },
  resumeFileName: { type: String, default: '' }
}, { timestamps: true });

export const JobSeeker = mongoose.models.JobSeeker || mongoose.model('JobSeeker', jobSeekerSchema);
export default JobSeeker;
