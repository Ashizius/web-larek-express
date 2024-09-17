import { Router } from 'express';

import fileMiddleware from '../middlewares/upload';
import uploadFile from '../controllers/upload';

const router = Router();

router.post('/', fileMiddleware, uploadFile);

export default router;
