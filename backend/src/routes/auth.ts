import { Router } from 'express';

import {
  login,
  logout,
  refreshToken,
  register,
  showUser,
  updateUser,
} from '../controllers/auth';
import { authByToken, checkRefreshToken } from '../middlewares/auth';
import { validateLogin, validateUser } from '../middlewares/users';

const router = Router();

router.get('/refresh', checkRefreshToken, refreshToken);
router.get('/token', checkRefreshToken, refreshToken);

router.post('/login', validateLogin, login);
router.post('/register', validateUser, register);
router.get('/logout', authByToken, logout);
router.get('/user', authByToken, showUser);
router.patch('/user', authByToken, validateUser, updateUser);

export default router;
