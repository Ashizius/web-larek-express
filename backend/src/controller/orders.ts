import { Request, Response, NextFunction } from 'express';
import products from '../models/products';
import { faker } from '@faker-js/faker';

import { IOrderItem } from '../models/orders';
import { logger } from '../middlewares/logger';

export function createOrder(req: Request, res: Response, next: NextFunction) {
  logger.debug('createOrder', req.body);
  const { total, items } = req.body;
  const orderId = faker.string.uuid();
  console.log(items);
  /*products
    .find({ _id: '66ddc0c1c1e1a685e03a966' }).then(console.log).catch(console.log);*/
  return products
    .find({ _id: items })
    .then((dbItems) => {
      if (dbItems.length!==items.length) {
        return Promise.reject({ code: 404, message:'предмет не найден в базе, проверьте заказ' });
      }
      let message = '';
      const dbTotal = dbItems.reduce((prev, dbItem) => {
        if (dbItem?.price) {
          return prev + Number(dbItem.price);
        } else {
          message += `${message === '' ? '' : ';'}предмет ${
            dbItem.title
          } не продаётся`;
          return prev;
        }
      }, 0);
      /*items.reduce((previous,item)=>{
        return Number(item.price )
      },0)*/
      console.log('MESSAGE', message);
      if (message !== '') {
        return Promise.reject({ code: 400, message });
      }
      if (dbTotal !== total) {
        message = 'цена товаров не соответствует, обновите страницу';
        return Promise.reject({ code: 400, message });
      }
      res.status(201).send({ _id: orderId, total });
    })
    .catch(next);
}
