import { Router } from 'express';
import attendanceController from '../controllers/attendance.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', attendanceController.getAttendance);
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);

export default router;
