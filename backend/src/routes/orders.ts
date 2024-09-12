import { createOrder } from '../controller/orders';
import { Router } from 'express';
import { validateOrder } from '../middlewares/orders';

const router = Router();

// сработает при POST-запросе на URL /films
router.post('/', validateOrder, createOrder);

export default router;
