import { Router } from 'express';
import candidateController from '../controllers/candidate.controller.js';
import authController from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import upload from '../middleware/upload.middleware.js';

// Router for Candidate Portal: mounted at /api/candidate
export const candidatePortalRouter = Router();

candidatePortalRouter.post('/auth/register', authController.candidateRegister);
candidatePortalRouter.post('/auth/login', authController.candidateLogin);
candidatePortalRouter.get('/profile', authenticateToken, candidateController.getProfile);
candidatePortalRouter.put('/profile', authenticateToken, candidateController.updateProfile);
candidatePortalRouter.get('/applications', authenticateToken, candidateController.getApplications);
candidatePortalRouter.post('/profile/resume', authenticateToken, upload.single('resume'), candidateController.uploadCandidateResume);
candidatePortalRouter.post('/apply', authenticateToken, upload.single('resume'), candidateController.candidateApply);

// Router for Recruiter Candidate Management: mounted at /api/candidates
export const candidatesManagementRouter = Router();

const hrRoles = authorizeRoles('Admin', 'HR Recruiter', 'HR', 'HR Manager');

candidatesManagementRouter.get('/', authenticateToken, hrRoles, candidateController.getAllCandidates);
candidatesManagementRouter.post('/', candidateController.createCandidate);
candidatesManagementRouter.post('/parse-resume', authenticateToken, hrRoles, upload.single('resume'), candidateController.parseResume);
candidatesManagementRouter.post('/:id/screen', authenticateToken, hrRoles, candidateController.screenCandidate);
candidatesManagementRouter.put('/:id/status', authenticateToken, hrRoles, candidateController.updateStatus);
candidatesManagementRouter.put('/:id/evaluation', authenticateToken, hrRoles, candidateController.updateEvaluation);
candidatesManagementRouter.put(
  '/:id/interview-report',
  authenticateToken,
  authorizeRoles('Admin', 'HR Recruiter', 'HR', 'HR Manager', 'Candidate'),
  candidateController.updateInterviewReport
);

export default {
  candidatePortalRouter,
  candidatesManagementRouter
};
