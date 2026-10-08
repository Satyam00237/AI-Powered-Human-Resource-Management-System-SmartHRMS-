import { Router } from 'express';
import jobController from '../controllers/job.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

const recruiterRoles = authorizeRoles('Admin', 'HR Recruiter');

router.get('/', jobController.getAllJobs);
router.post('/', authenticateToken, recruiterRoles, jobController.createJob);
router.put('/:id', authenticateToken, recruiterRoles, jobController.updateJob);
router.delete('/:id', authenticateToken, recruiterRoles, jobController.deleteJob);

export default router;
