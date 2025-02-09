import express from 'express';
import { uploadRepo, getStatus } from '../controllers/upload.controller';

const router = express.Router();

router.post('/upload', uploadRepo);
router.get('status', getStatus);

export default router;