import { Router } from 'express';
import policyController from '../controllers/policy.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', policyController.getAllPolicies);
router.put('/:title', authorizeRoles('Admin'), policyController.updatePolicy);

export default router;
