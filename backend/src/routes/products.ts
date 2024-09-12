import { createProduct, getProduct } from '../controller/products';
import { Router } from 'express';

import { validateProducts, validateProductsId } from '../middlewares/products';
const router = Router();
router.get('/' ,getProduct);

// сработает при POST-запросе на URL /films
router.post('/',validateProducts, createProduct);
//router.patch('/:prodictId',validateProductsId,validateProducts, ()={});
//router.delete('/:prodictId',validateProductsId,validateProducts, ()={});

export default router;