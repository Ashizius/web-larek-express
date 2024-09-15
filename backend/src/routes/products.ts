import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
} from '../controllers/products';

import validateProducts from '../middlewares/products';
import checkId from '../middlewares/checkId';
import { authByToken } from '../middlewares/auth';

const router = Router();
router.get('/', getProduct);

router.post('/', validateProducts, authByToken, createProduct);
router.patch(
  '/:productId',
  checkId,
  validateProducts,
  authByToken,
  editProduct,
);
router.delete('/:productId', checkId, authByToken, deleteProduct);

export default router;
