import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/badRequestError';
import { logger } from './logger';

const checkId = (req: Request, _: Response, next: NextFunction) => {
  if (!req.params) return next(new BadRequestError('необходим идентификатор'));

  if (!req.params.id && !req.params.productId && !req.params.userId) {
    return next(new BadRequestError('необходим идентификатор'));
  }

  Object.assign(req.body, req.params);
  logger.debug('checkedId');
  return next();
};

export default checkId;
