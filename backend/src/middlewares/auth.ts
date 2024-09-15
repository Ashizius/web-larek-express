import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import UnauthorizedError from '../errors/unauthorizedError';
import { logger } from './logger';
import secretKey from '../utils/accessKey';

const unpackToken = (authorization: string):string | jwt.JwtPayload|null => {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
  return payload;
};

export const authByToken = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  let payload;
  if (authorization) {
    payload = unpackToken(authorization);
  }
  if (!payload || !authorization || typeof payload === 'string') {
    return next(new UnauthorizedError('Необходима авторизация')); // 401
  }
  Object.assign(req.body, { _id: payload._id }); // записываем пейлоад в объект запроса
  logger.debug('authorized by accessToken');
  return next();
};

export const checkRefreshToken = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const authorization = req.cookies.refreshToken;
  const payload = unpackToken(authorization);
  if (!payload || typeof payload === 'string') {
    return next(new UnauthorizedError('Необходима авторизация')); // 401
  }
  Object.assign(req.body, { _id: payload._id });
  logger.debug('refreshed Token');
  return next();
};
