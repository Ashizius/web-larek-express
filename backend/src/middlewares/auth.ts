import jwt from 'jsonwebtoken';
import ms from 'ms';
import { Request, Response, NextFunction } from 'express';
import users, { IUser, UserModel } from '../models/users';

import UnauthorizedError from '../errors/unauthorizedError';

const unpackToken = (authorization: string) => {
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
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
  const { authorization } = req.headers;
  let payload;
  if (authorization) {
    payload = unpackToken(authorization);
  }
  if (!payload||!authorization) {
    return next(new UnauthorizedError('Необходима авторизация')); //401
  }
  Object.assign(req, payload); // записываем пейлоад в объект запроса
  return next();
};

export const checkRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // достаём авторизационный заголовок
  const authorization = req.cookies.REFRESH_TOKEN;
  const payload = unpackToken(authorization);
  if (!payload) {
    return next(new UnauthorizedError('Необходима авторизация')); //401
  }
  Object.assign(req, payload);
  return next();
  /*const accessToken = jwt.sign(payload, 'some-secret-access-key', { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, 'some-secret-access-key', { expiresIn: '7d' });
  res.status(200).send({ accessToken });*/
};
