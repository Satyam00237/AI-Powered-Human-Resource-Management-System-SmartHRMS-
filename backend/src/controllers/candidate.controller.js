import { Candidate } from '../models/Candidate.js';
import { JobSeeker } from '../models/JobSeeker.js';
import { Job } from '../models/Job.js';
import resumeService from '../services/resume.service.js';
import geminiService from '../services/gemini.service.js';

// --- Candidate Portal Endpoints ---

export const getProfile = async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ error: 'Access denied. Candidates only.' });
    }
    const seeker = await JobSeeker.findOne({ email: req.user.email.toLowerCase() }).lean();
    if (!seeker) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json(seeker);
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ error: 'Access denied. Candidates only.' });
    }
    const { name, skills, education, experience } = req.body;
    const seeker = await JobSeeker.findOne({ email: req.user.email.toLowerCase() });
    if (!seeker) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    if (name !== undefined) seeker.name = name;
    if (skills !== undefined) seeker.skills = skills;
    if (education !== undefined) seeker.education = education;
    if (experience !== undefined) seeker.experience = experience;

    await seeker.save();
    res.json(seeker.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};

export const getApplications = async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ error: 'Access denied. Candidates only.' });
    }
    const list = await Candidate.find({ email: req.user.email.toLowerCase() }).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
};

export const uploadCandidateResume = async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ error: 'Access denied. Candidates only.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const textContent = await resumeService.parsePdfBuffer(req.file.buffer);

    const seeker = await JobSeeker.findOne({ email: req.user.email.toLowerCase() });
    if (!seeker) {
      return res.status(404).json({ error: 'Candidate profile not found.' });
    }

    seeker.resumeText = textContent;
    seeker.resumeFileName = req.file.originalname;
    await seeker.save();

    res.json({
      success: true,
      message: 'Resume PDF uploaded and parsed successfully.',
      resumeFileName: req.file.originalname,
      profile: seeker.toObject()
    });
  } catch (e) {
    console.error('PDF parsing error:', e);
    res.status(500).json({ error: e.message || 'Failed to parse and save PDF resume.' });
  }
};

export const candidateApply = async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ error: 'Access denied. Candidates only.' });
    }
    const { jobId, name, skills, education, experience } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: 'Missing jobId' });
    }

    const seeker = await JobSeeker.findOne({ email: req.user.email.toLowerCase() });
    if (!seeker) {
      return res.status(404).json({ error: 'Candidate profile not found.' });
    }

    let resumeText = seeker.resumeText;
    let resumeFileName = seeker.resumeFileName;

    if (req.file) {
      resumeText = await resumeService.parsePdfBuffer(req.file.buffer);
      resumeFileName = req.file.originalname;
    }

    if (!resumeText) {
      return res.status(400).json({ error: 'Please upload a PDF resume first or during application.' });
    }

    const job = await Job.findOne({ id: jobId });

    // Check if already applied
    const existingApplication = await Candidate.findOne({
      jobId,
      email: req.user.email.toLowerCase()
    });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job position.' });
    }

    const newApplication = new Candidate({
      id: `CAN${Date.now()}`,
      jobId,
      jobTitle: job ? job.title : 'Unknown Position',
      name: name || seeker.name || req.user.name,
      email: req.user.email.toLowerCase(),
      resumeText,
      resumeFileName: resumeFileName || '',
      skills: skills !== undefined ? skills : seeker.skills,
      education: education !== undefined ? education : seeker.education,
      experience: experience !== undefined ? experience : seeker.experience,
      matchScore: 0,
      status: 'Applied'
    });

    await newApplication.save();

    if (job) {
      job.candidatesCount += 1;
      await job.save();
    }

    res.status(201).json(newApplication.toObject());
  } catch (e) {
    console.error('Job application error:', e);
    res.status(500).json({ error: e.message || 'Failed to submit job application.' });
  }
};

// --- Recruiter & Candidate Management Endpoints ---

export const getAllCandidates = async (req, res) => {
  try {
    const list = await Candidate.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    console.error('Error in GET /api/candidates:', e);
    res.status(500).json({ error: 'Failed to fetch candidates', details: e.message || String(e) });
  }
};

export const createCandidate = async (req, res) => {
  try {
    const { jobId, name, email, skills, resumeText } = req.body;
    if (!jobId || !name || !email || !resumeText) {
      return res.status(400).json({ error: 'Missing required candidate fields' });
    }

    const job = await Job.findOne({ id: jobId });

    const newCandidate = new Candidate({
      id: `CAN${Date.now()}`,
      jobId,
      jobTitle: job ? job.title : 'Unknown Position',
      name,
      email: email.toLowerCase().trim(),
      resumeText,
      skills: skills || '',
      matchScore: 0,
      status: 'Applied',
      evaluation: null,
      interviewReport: null
    });

    await newCandidate.save();

    if (job) {
      job.candidatesCount += 1;
      await job.save();
    }

    res.status(201).json(newCandidate.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to add candidate' });
  }
};

export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const textContent = await resumeService.parsePdfBuffer(req.file.buffer);
    res.json({ text: textContent });
  } catch (e) {
    console.error('PDF parsing error:', e);
    res.status(500).json({ error: e.message || 'Failed to parse PDF resume.' });
  }
};

export const screenCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findOne({ id });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    const job = await Job.findOne({ id: candidate.jobId });
    const jobDescStr = job
      ? `Job Title: ${job.title}\nDepartment: ${job.department}\nLocation: ${job.location}\nType: ${job.type}\n\nJob Description:\n${job.description}`
      : 'General Role';
    const jobTitle = job ? job.title : candidate.jobTitle || '';

    const result = await geminiService.screenResume(
      jobDescStr,
      candidate.resumeText,
      candidate.skills,
      jobTitle
    );

    candidate.matchScore = result.matchScore;
    candidate.evaluation = result;
    candidate.status =
      result.recommendation === 'Strong Match' || result.recommendation === 'Recommended'
        ? 'Interviewing'
        : 'Screening';

    await candidate.save();

    res.json({
      success: true,
      candidate: candidate.toObject(),
      result
    });
  } catch (e) {
    console.error('Error screening existing candidate:', e);
    res.status(500).json({ error: 'Failed to run AI screening.' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      interviewDate,
      interviewTime,
      interviewEndTime,
      techInterviewDate,
      techInterviewTime,
      techInterviewEndTime
    } = req.body;

    if (!['Applied', 'Screening', 'Interviewing', 'Shortlisted', 'Rejected', 'Offered', 'Hired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid candidate status.' });
    }

    const candidate = await Candidate.findOne({ id });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    candidate.status = status;
    if (interviewDate !== undefined) candidate.interviewDate = interviewDate;
    if (interviewTime !== undefined) candidate.interviewTime = interviewTime;
    if (interviewEndTime !== undefined) candidate.interviewEndTime = interviewEndTime;
    if (techInterviewDate !== undefined) candidate.techInterviewDate = techInterviewDate;
    if (techInterviewTime !== undefined) candidate.techInterviewTime = techInterviewTime;
    if (techInterviewEndTime !== undefined) candidate.techInterviewEndTime = techInterviewEndTime;

    await candidate.save();
    res.json(candidate.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to update candidate status.' });
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, matchScore, evaluation } = req.body;

    const cand = await Candidate.findOne({ id });
    if (!cand) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (status !== undefined) cand.status = status;
    if (matchScore !== undefined) cand.matchScore = matchScore;
    if (evaluation !== undefined) cand.evaluation = evaluation;

    await cand.save();
    res.json(cand.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to save candidate evaluation' });
  }
};

export const updateInterviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, matchScore, interviewReport } = req.body;

    const cand = await Candidate.findOne({ id });
    if (!cand) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (status !== undefined) cand.status = status;
    if (matchScore !== undefined) cand.matchScore = matchScore;
    if (interviewReport !== undefined) cand.interviewReport = interviewReport;

    await cand.save();
    res.json(cand.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to save interview report' });
  }
};

export default {
  getProfile,
  updateProfile,
  getApplications,
  uploadCandidateResume,
  candidateApply,
  getAllCandidates,
  createCandidate,
  parseResume,
  screenCandidate,
  updateStatus,
  updateEvaluation,
  updateInterviewReport
};
