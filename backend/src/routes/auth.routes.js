import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/register (candidate registration alias)
router.post('/register', authController.candidateRegister);

export default router;
