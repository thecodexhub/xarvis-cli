import express from 'express';
import { healthController } from '../../controllers';

const router = express.Router();
router.get('/health', healthController.getHealth);

export default router;
