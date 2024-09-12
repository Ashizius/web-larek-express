import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //console.log(error);
  //console.log(error.message);
  if (error.code) {
    switch (error.code) {
      case 11000:
        res.status(409).send({ message: 'Такой предмет уже есть' });
        return;
      case 400:
      case 404:
        res.status(error.code).send({ message: error.message });
        return;
      default:
        res.status(500).send({ message: 'Произошла ошибка' });
        return;
    }
  }
  res.status(500).send({ message: 'Произошла ошибка' });
};
