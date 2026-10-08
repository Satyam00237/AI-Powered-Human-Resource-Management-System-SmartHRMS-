import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { Employee } from '../models/Employee.js';
import { JobSeeker } from '../models/JobSeeker.js';

export function signToken(payload, expiresIn = '24h') {
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured on server.');
  }
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
}

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error('Missing email or password');
  }

  // 1. Check Employees
  let user = await Employee.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') }).lean();
  let isCandidate = false;

  // 2. Fallback: Check JobSeekers (Candidate account)
  if (!user) {
    const seeker = await JobSeeker.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') }).lean();
    if (seeker) {
      user = seeker;
      isCandidate = true;
    }
  }

  if (!user) {
    const err = new Error('Invalid credentials. User not found.');
    err.status = 401;
    throw err;
  }

  // Verify password (either the custom saved password or default 'password')
  const correctPassword = user.password || 'password';
  if (password !== correctPassword) {
    const err = new Error('Invalid credentials. Incorrect password.');
    err.status = 401;
    throw err;
  }

  const tokenPayload = isCandidate
    ? { email: user.email, name: user.name, role: 'Candidate' }
    : { id: user.id, name: user.name, email: user.email, role: user.role };

  const token = signToken(tokenPayload);

  return {
    id: isCandidate ? undefined : user.id,
    name: user.name,
    email: user.email,
    role: isCandidate ? 'Candidate' : user.role,
    avatar: isCandidate ? undefined : user.avatar,
    token
  };
}

export async function registerCandidate({ name, email, password }) {
  if (!name || !email || !password) {
    const err = new Error('Missing name, email, or password');
    err.status = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await JobSeeker.findOne({ email: normalizedEmail });
  if (existing) {
    const err = new Error('A candidate with this email already exists.');
    err.status = 400;
    throw err;
  }

  const newSeeker = new JobSeeker({
    name,
    email: normalizedEmail,
    password
  });
  await newSeeker.save();

  const token = signToken(
    { email: newSeeker.email, name: newSeeker.name, role: 'Candidate' },
    '24h'
  );

  return {
    name: newSeeker.name,
    email: newSeeker.email,
    role: 'Candidate',
    token
  };
}

export async function loginCandidate(email, password) {
  if (!email || !password) {
    const err = new Error('Missing email or password');
    err.status = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const seeker = await JobSeeker.findOne({ email: normalizedEmail });
  if (!seeker || seeker.password !== password) {
    const err = new Error('Invalid candidate credentials.');
    err.status = 401;
    throw err;
  }

  const token = signToken(
    { email: seeker.email, name: seeker.name, role: 'Candidate' },
    '24h'
  );

  return {
    name: seeker.name,
    email: seeker.email,
    role: 'Candidate',
    token
  };
}

export default {
  signToken,
  loginUser,
  registerCandidate,
  loginCandidate
};
