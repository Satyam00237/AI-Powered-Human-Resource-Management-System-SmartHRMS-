import { Job } from '../models/Job.js';
import { Candidate } from '../models/Candidate.js';

export const getAllJobs = async (req, res) => {
  try {
    const list = await Job.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, department, type, location, description } = req.body;
    if (!title || !department || !type || !location || !description) {
      return res.status(400).json({ error: 'Missing required job fields' });
    }

    const count = await Job.countDocuments();
    const newId = `JOB${String(count + 1).padStart(3, '0')}`;

    const newJob = new Job({
      id: newId,
      title,
      department,
      type,
      location,
      status: 'Open',
      description,
      candidatesCount: 0
    });

    await newJob.save();
    res.status(201).json(newJob.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to create job' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOne({ id });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const data = req.body;
    if (data.title !== undefined) job.title = data.title;
    if (data.department !== undefined) job.department = data.department;
    if (data.type !== undefined) job.type = data.type;
    if (data.location !== undefined) job.location = data.location;
    if (data.status !== undefined) job.status = data.status;
    if (data.description !== undefined) job.description = data.description;

    await job.save();
    res.json(job.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to update job' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Job.deleteOne({ id });
    if (result.deletedCount > 0) {
      // Also delete candidates associated with this jobId
      await Candidate.deleteMany({ jobId: id });
      res.json({ success: true, message: 'Job deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Job not found.' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete job.' });
  }
};

export default {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob
};
