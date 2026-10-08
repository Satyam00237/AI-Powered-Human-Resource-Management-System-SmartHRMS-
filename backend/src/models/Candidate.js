import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeText: { type: String, required: true },
  resumeFileName: { type: String, default: '' },
  skills: { type: String, default: '' },
  education: { type: String, default: '' },
  experience: { type: String, default: '' },
  matchScore: { type: Number, default: 0 },
  status: { type: String, default: 'Applied' }, // 'Applied', 'Screening', 'Interviewing', etc.
  interviewDate: { type: String, default: '' },
  interviewTime: { type: String, default: '' },
  interviewEndTime: { type: String, default: '' },
  techInterviewDate: { type: String, default: '' },
  techInterviewTime: { type: String, default: '' },
  techInterviewEndTime: { type: String, default: '' },
  evaluation: {
    score: Number,
    strengths: [String],
    weaknesses: [String],
    recommendation: String
  },
  interviewReport: {
    score: Number,
    confidence: String,
    communication: String,
    technical: String,
    feedback: String,
    reportText: String
  }
}, { timestamps: true });

export const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);
export default Candidate;
