import express from 'express';
import { analyzeController } from '../controllers/analyzeController.js';

const router = express.Router();

router.post('/analyze', analyzeController);

export default router;

