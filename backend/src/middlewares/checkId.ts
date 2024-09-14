import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/badRequestError';
import { logger } from './logger';

export const checkId = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params) return next(new BadRequestError('необходим идентификатор'));

  if (!req.params.id && !req.params.productId && !req.params.userId) {
    return next(new BadRequestError('необходим идентификатор'));}

  Object.assign(req.body, req.params);
  logger.debug('checkedId');
  console.log('req.body:',req.body);
  return next();
}