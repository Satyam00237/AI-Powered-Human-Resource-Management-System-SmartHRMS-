import { Router } from 'express';
import settingsController from '../controllers/settings.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

// GET /api/settings/has-key
router.get('/has-key', settingsController.hasGeminiKey);

// POST /api/settings/key
router.post('/key', authenticateToken, authorizeRoles('Admin'), settingsController.updateGeminiKey);

export default router;
