import { Request, Response, NextFunction } from 'express';
import products from '../models/products';
import { logger } from '../middlewares/logger';

export function getProduct(req: Request, res: Response) {
  //console.log('getProduct by ',req.ip);
  return products
    .find({})
    .then((items) => res.status(200).send({ items: items }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export function createProduct(req: Request, res: Response, next: NextFunction) {
  logger.debug('createOrder', req.body);
  const { description, image, title, category, price } = req.body;
  return products
    .create({ description, image, title, category, price })
    .then((item) => res.status(201).send(item)).catch(next);
    /*.catch((error) => {
      //next(new Erorr(error));
      console.log(error);
      if (error.code === 11000) {
        res.status(409).send({ message: 'Такой предмет уже есть' });
        return
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });*/
}
