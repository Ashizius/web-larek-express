import { createProduct, getProduct } from '../controllers/products';
import { Router } from 'express';

import { validateProducts } from '../middlewares/products';
import { checkId } from '../middlewares/checkId';
const router = Router();
router.get('/', getProduct);

// сработает при POST-запросе на URL /films
router.post('/', validateProducts, createProduct);
router.patch('/:productId', checkId, validateProducts, createProduct);
//router.patch('/:prodictId',validateProductsId,validateProducts, ()={});
//router.delete('/:prodictId',validateProductsId,validateProducts, ()={});

export default router;