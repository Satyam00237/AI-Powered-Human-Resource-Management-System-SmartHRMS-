import { Router } from 'express';
import leaveController from '../controllers/leave.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateToken);

const managerRoles = authorizeRoles('Admin', 'Senior Manager');

router.get('/', leaveController.getLeaves);
router.post('/', leaveController.requestLeave);
router.put('/:id/approve', managerRoles, leaveController.approveLeave);
router.put('/:id/reject', managerRoles, leaveController.rejectLeave);

export default router;
