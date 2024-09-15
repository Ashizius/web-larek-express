import { Request, Response, NextFunction } from 'express';

import path from 'path';
import * as fs from 'node:fs/promises';
import products from '../models/products';
import { logger } from '../middlewares/logger';

export function getProduct(_:Request, res: Response) {
  return products
    .find({})
    .then((items) => res.status(200).send({ items }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { _id, ...payload } = req.body;
  logger.debug('Product created');
  products
    .createProduct(payload)
    .then((item) => res.status(201).send(item))
    .catch(next);
}

export async function editProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { _id, productId, ...payload } = req.body;
  logger.debug('Product updated');
  products
    .updateProduct(productId, payload)
    .then((item) => res.status(201).send(item))
    .catch(next);
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.debug('deleteProduct', req.body, __dirname);
  const { productId } = req.body;
  let item;
  try {
    item = await products.findByIdAndDelete(productId);
    if (item?.image.fileName) {
      const filePath = path.join(__dirname, '../public/', item.image.fileName);
      await fs.unlink(filePath);
      logger.debug('deleted file:', filePath);
    }
    return res.status(201).send(item);
  } catch (error) {
    return next(error);
  }
}
