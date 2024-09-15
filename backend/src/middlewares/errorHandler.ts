import { Request, Response, NextFunction } from 'express';
import ConflictError from '../errors/conflictError';
import NotFoundError from '../errors/notFoundError';

export const dbErrorHandler = (
  error: any,
  _: Request,
  __: Response,
  next: NextFunction,
) => {
  if (error.code) {
    let dbName;
    let keyName;
    if (error.message.indexOf('weblarek.products') > 0) {
      dbName = 'Продукт';
      keyName = error.keyValue.title;
    } else if (error.message.indexOf('weblarek.users') > 0) {
      dbName = 'Пользователь';
      keyName = error.keyValue.name;
    }
    if (error.code === 11000) return next(new ConflictError(`${dbName} ${keyName} уже есть`));
    const isNotFound = error.message.indexOf('not found') > 0;
    const isCastError = error.message.indexOf('Cast to ObjectId failed') > 0;
    if (isNotFound || isCastError) {
      return next(
        new NotFoundError('запись не найдена или передан некорректный id'),
      );
    }
  }
  return next(error);
};

const statusCodes = [400, 401, 404, 409];

export const errorHandler = (error: any, _: Request, res: Response) => {
  if (error.statusCode) {
    if (statusCodes.includes(error.statusCode)) {
      res.status(error.statusCode).send({ message: error.message });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка' });
    return;
  }

  res.status(500).send({ message: 'Произошла ошибка' });
};
