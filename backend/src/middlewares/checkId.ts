import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/badRequestError';

export const checkId = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params) return next(new BadRequestError('необходим идентификатор'));

  if (!req.params.id || !req.params.prodictId || !req.params.userId) return next(new BadRequestError('необходим идентификатор'));

  Object.assign(req.body, req.params);
  return next();
}