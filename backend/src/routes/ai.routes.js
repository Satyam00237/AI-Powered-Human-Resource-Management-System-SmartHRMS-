import { Router } from 'express';
import aiController from '../controllers/ai.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateToken);

const recruiterRoles = authorizeRoles('Admin', 'HR Recruiter');
const interviewRoles = authorizeRoles('Admin', 'HR Recruiter', 'Candidate');

router.post('/screen', recruiterRoles, aiController.screenResume);
router.post('/interview/question', interviewRoles, aiController.getNextInterviewQuestion);
router.post('/interview/evaluate', interviewRoles, aiController.evaluateInterview);
router.post('/chatbot', aiController.askChatbot);

export default router;
