import { Router } from 'express';
import cookieParser from 'cookie-parser';
//const cookieParser = require('cookie-parser');

import { login, logout, refreshToken, register, showUser, update } from "../controllers/auth";
import { authByToken, checkRefreshToken } from "../middlewares/auth";
import { validateLogin, validateUser } from '../middlewares/users';

const router = Router();

router.use(cookieParser());

router.get('/refresh', checkRefreshToken, refreshToken);
router.get('/token', checkRefreshToken, refreshToken);

router.post('/login', validateLogin, login);
router.post('/register', authByToken, validateUser, register);
router.get('/logout', authByToken, logout);
router.get('/user', authByToken, showUser);
router.patch('/user', authByToken, validateUser, update);

export default router