import { Request, Response, NextFunction } from 'express';
import { secretKey } from '../accessKey';
import users, { IUser, userDocument, UserModel } from '../models/users';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import BadRequestError from '../errors/badRequestError';
import mongoose from 'mongoose';
import InternalError from '../errors/internalError';

export const signAndSend = (
  res: Response,
  user: userDocument | null,
  isSendUser = true
) => {
  if (!user)
    return Promise.reject(new InternalError('ошибка получения данных'));
  const { email, name, _id } = user;
  if (!_id || !email || !name)
    return Promise.reject(new InternalError('ошибка получения данных'));

  const accessToken = jwt.sign({ _id }, secretKey, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ _id }, secretKey, {
    expiresIn: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
  });
  return users.updateRefreshToken(_id, { token: refreshToken }).then(() => {
    res.cookie('refreshToken', refreshToken, {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
      maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
      path: '/',
    });
    if (!isSendUser) {
      res.status(200).send({ accessToken });
    }
    res.status(200).send({
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
  const {
    user: { _id },
  } = req.body;
  res.cookie('refreshToken', '', {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: 1,
    path: '/',
  });
  return users
    .clearRefreshToken(_id)
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch(next);
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  return users
    .createUserByCredentials(name, email, password)
    .then((dbUser) => signAndSend(res, dbUser))
    .catch(next);
};

export const update = (req: Request, res: Response, next: NextFunction) => {
  const { _id, ...other } = req.body;
  return users
    .findByIdAndUpdate(_id, other)
    .then((dbUser) => signAndSend(res, dbUser))
    .catch(next);
};

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.body;
  return users
    .findById(_id)
    .then((dbUser) => signAndSend(res, dbUser, false))
    .catch(next);
};

export const showUser = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.body;
  return users
    .findById(_id)
    .then((dbUser) => res.status(200).send(dbUser))
    .catch(next);
};
