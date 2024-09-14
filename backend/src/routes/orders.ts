import { Router } from 'express';

import { createOrder } from '../controllers/orders';
import { validateOrder } from '../middlewares/orders';
import { authByToken } from '../middlewares/auth';

const router = Router();

router.post('/', validateOrder, /*authByToken,*/ createOrder); //закомментировал в соответствие с фронтендом

export default router;
