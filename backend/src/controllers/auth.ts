import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import secretKey from '../utils/accessKey';
import users, { UserDocument } from '../models/users';
import InternalError from '../errors/internalError';
import { logger } from '../middlewares/logger';

export const signAndSend = (
  res: Response,
  userDocument: UserDocument | null,
  isSendUser = true,
  isNewUser = false,
) => {
  if (!userDocument) {
    return Promise.reject(new InternalError('ошибка получения данных'));
  }
  const user = userDocument.toObject();

  const { email, name, _id } = user;

  if (!_id || !email || !name) {
    return Promise.reject(new InternalError('ошибка получения данных'));
  }

  const accessToken = jwt.sign({ _id }, secretKey, {
    expiresIn: ms(process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1m'),
  });
  const refreshToken = `Bearer ${jwt.sign({ _id }, secretKey, {
    expiresIn: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
  })}`;

  return users.updateRefreshToken(_id, { token: refreshToken }).then(() => {
    res.cookie('refreshToken', refreshToken, {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
      maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
      path: '/',
    });
    logger.debug('updated RefreshToken in DB');
    if (!isSendUser) {
      res.status(200).send({ accessToken });
      return;
    }
    res.status(isNewUser ? 201 : 200).send({
      user: { email, name },
      success: true,
      accessToken,
    });
  });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return users
    .findUserByCredentials(email, password)
    .then((dbUser) => signAndSend(res, dbUser))
    .catch(next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const id = req.body._id;
  res.cookie('refreshToken', '', {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: 1,
    path: '/',
  });
  return users
    .clearRefreshToken(id)
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch(next);
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  return users
    .createUserByCredentials(name, email, password)
    .then((dbUser) => signAndSend(res, dbUser, true, true))
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { _id, ...other } = req.body;
  return users
    .updateUser(_id, other)
    .then((dbUser) => signAndSend(res, dbUser))
    .catch(next);
};

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.body._id;
  logger.debug('refreshToken', req.body);
  return users
    .findById(id)
    .then((dbUser) => signAndSend(res, dbUser, false))
    .catch(next);
};

export const showUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.body._id;
  return users
    .findById(id)
    .then((dbUser) => {
      const user = dbUser?.toObject();
      res.status(200).send({ user: { name: user?.name, email: user?.email } });
    })
    .catch(next);
};
