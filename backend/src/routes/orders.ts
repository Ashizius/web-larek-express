import { Router } from 'express';

import { createOrder } from '../controllers/orders';
import { validateOrder } from '../middlewares/orders';

const router = Router();

router.post('/', validateOrder, createOrder);

export default router;
