import { Router } from 'express';
import employeeController from '../controllers/employee.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

// Current employee profile
router.get('/me', authenticateToken, employeeController.getMe);
router.put('/me/profile', authenticateToken, employeeController.updateMeProfile);

// Management routes
router.get('/', authenticateToken, authorizeRoles('Admin', 'Senior Manager'), employeeController.getAllEmployees);
router.post('/', authenticateToken, authorizeRoles('Admin'), employeeController.createEmployee);
router.put('/:id/toggle-status', authenticateToken, authorizeRoles('Admin'), employeeController.toggleStatus);
router.put('/:id', authenticateToken, authorizeRoles('Admin'), employeeController.updateEmployee);

export default router;
