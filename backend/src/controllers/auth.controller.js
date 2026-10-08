import authService from '../services/auth.service.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      details: error.message || String(error)
    });
  }
};

export const candidateRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerCandidate({ name, email, password });
    res.status(201).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Candidate registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed.' });
  }
};

export const candidateLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginCandidate(email, password);
    res.json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Candidate login error:', error);
    res.status(500).json({ error: error.message || 'Login failed.' });
  }
};

export default {
  login,
  candidateRegister,
  candidateLogin
};
