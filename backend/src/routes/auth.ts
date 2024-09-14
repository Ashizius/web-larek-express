import { Router } from 'express';
//const cookieParser = require('cookie-parser');

import { login, logout, refreshToken, register, showUser, updateUser } from "../controllers/auth";
import { authByToken, checkRefreshToken } from "../middlewares/auth";
import { validateLogin, validateUser } from '../middlewares/users';
import { showReqBody } from '../middlewares/logger';
import { Request, Response, NextFunction } from 'express';

const router = Router();



router.get('/refresh', checkRefreshToken, refreshToken);
router.get('/token', checkRefreshToken, refreshToken);
//router.get('/token', (req: Request, res: Response)=>res.status(200).send({ok:'ok'}));

router.post('/login', validateLogin, login);
router.post('/register', validateUser, register);
router.get('/logout', authByToken, logout);
router.get('/user', authByToken, showUser);
//router.get('/user', (req: Request, res: Response)=>res.status(200).send({ok:'ok'}));
router.patch('/user', authByToken, validateUser, updateUser);

export default router