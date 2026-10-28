import { Router } from 'express';
import { generateScriptController } from '../controllers/script.controller.js';

const router = Router();

// POST /api/v1/scripts/generate
router.post('/generate', generateScriptController);

export default router;
