import { Request, Response, NextFunction } from 'express';
import ConflictError from '../errors/conflictError';
import NotFoundError from '../errors/notFoundError';



export const dbErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  //console.log(error.message);
  if (error.code) {
    if (error.code === 11000) return next(new ConflictError('такая запись уже есть'));
    const isNotFound = error.message.indexOf('not found')>0;
    const isCastError = error.message.indexOf('Cast to ObjectId failed')>0;
    if (isNotFound||isCastError) return next(new NotFoundError('запись не найдена или передан некорректный id'));
  }
  next();
};


export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //console.log(error);
  //console.log(error.message);
  if (error.statusCode) {
    switch (error.statusCode) {
      case 400:
      case 404:
      case 409:
        res.status(error.code).send({ message: error.message });
        return;
      default:
        res.status(500).send({ message: 'Произошла ошибка' });
        return;
    }
  }
  res.status(500).send({ message: 'Произошла ошибка' });
};
