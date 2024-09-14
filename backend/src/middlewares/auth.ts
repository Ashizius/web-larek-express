import jwt from 'jsonwebtoken';
import ms from 'ms';
import { Request, Response, NextFunction } from 'express';
import users, { IUser, UserModel } from '../models/users';

import UnauthorizedError from '../errors/unauthorizedError';
import { logger } from './logger';
import { secretKey } from '../utils/accessKey';

const unpackToken = (authorization: string) => {
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return;
  }
  return payload;
};

export const authByToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // достаём авторизационный заголовок
  logger.debug('authByToken: ROUTE:', req.route);
  logger.debug('authByToken: Params:', req.params);
  const authorization = req.headers.authorization;
  let payload;
  if (authorization) {
    payload = unpackToken(authorization);
  }
  if (!payload || !authorization || typeof payload === 'string') {
    logger.debug('authByToken: Необходима авторизация');
    return next(new UnauthorizedError('Необходима авторизация')); //401
  }
  Object.assign(req.body, {_id: payload._id}); // записываем пейлоад в объект запроса
  console.log('req.body:', req.body);
  logger.debug('authorized by accessToken');
  return next();
};

export const checkRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // достаём авторизационный заголовок\
  const authorization = req.cookies.refreshToken;
  const payload = unpackToken(authorization);
  if (!payload||typeof payload === 'string') {
    return next(new UnauthorizedError('Необходима авторизация')); //401
  }
  Object.assign(req.body, {_id: payload._id});
  logger.debug('refreshed Token');
  return next();
  /*const accessToken = jwt.sign(payload, 'some-secret-access-key', { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, 'some-secret-access-key', { expiresIn: '7d' });
  res.status(200).send({ accessToken });*/
};
