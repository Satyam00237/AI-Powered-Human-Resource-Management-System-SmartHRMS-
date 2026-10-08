import { Policy } from '../models/Policy.js';

export const getAllPolicies = async (req, res) => {
  try {
    const list = await Policy.find().lean();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch policies' });
  }
};

export const updatePolicy = async (req, res) => {
  try {
    const { title } = req.params;
    const policy = await Policy.findOne({ title });
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    const data = req.body;
    if (data.content !== undefined) policy.content = data.content;
    if (data.title !== undefined && data.title !== title) {
      policy.title = data.title;
    }

    await policy.save();
    res.json(policy.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to update policy' });
  }
};

export default {
  getAllPolicies,
  updatePolicy
};
