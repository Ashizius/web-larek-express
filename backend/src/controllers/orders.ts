import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';

import NotFoundError from '../errors/notFoundError';
import BadRequestError from '../errors/badRequestError';
import products from '../models/products';
import { logger } from '../middlewares/logger';

export default function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.debug('createOrder', req.body);
  const { total, items } = req.body;
  const orderId = faker.string.uuid();
  return products
    .find({ _id: items })
    .then((dbItems) => {
      if (dbItems.length !== items.length) {
        return Promise.reject(new NotFoundError('предмет не найден в базе, проверьте заказ'));
      }
      let message = '';
      const dbTotal = dbItems.reduce((prev, dbItem) => {
        if (dbItem?.price) {
          return prev + Number(dbItem.price);
        }
        message += `${message === '' ? '' : ';'}предмет ${
          dbItem.title
        } не продаётся`;
        return prev;
      }, 0);
      if (message !== '') {
        return Promise.reject(new BadRequestError(message));
      }
      if (dbTotal !== total) {
        return Promise.reject(new BadRequestError('цена товаров не соответствует, обновите страницу'));
      }
      return res.status(201).send({ _id: orderId, total });
    })
    .catch(next);
}
