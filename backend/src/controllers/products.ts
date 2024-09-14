import { Request, Response, NextFunction } from 'express';

import products from '../models/products';
import { logger } from '../middlewares/logger';
import { pauseUploadsClear, resumeUploadsClear } from '../utils/clearUpload';
//import { getDirname } from '../utils/getDirname';
import path from 'path';
import * as fs from 'node:fs/promises';

//const __dirname = getDirname(import.meta.url);

export function getProduct(req: Request, res: Response) {
  //console.log('getProduct by ',req.ip);
  return products
    .find({})
    .then((items) => res.status(200).send({ items: items }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { _id, ...payload } = req.body;
  products
    .createProduct(payload)
    .then((item) => res.status(201).send(item))
    .catch(next);
  //image.filename = path.basename(image.fileName);
}

export async function editProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug('@@@@@@@@@@@@@@@@@@@@@@@editProduct');
  const { _id, productId, ...payload } = req.body;
  console.log(payload);
  products
    .updateProduct(productId, payload)
    .then((item) => res.status(201).send(item))
    .catch(next);
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug('deleteProduct', req.body, __dirname);
  const { productId } = req.body;
  let item;
  try {
    item = await products.findByIdAndDelete(productId);
    if (item?.image.fileName) {
      const filePath = path.join(__dirname, '../public/', item.image.fileName);
      //await fs.unlink(fileName);
      console.log(filePath);
    }
    res.status(201).send(item);
    return;
  } catch (error) {
    return next(error);
  }
}

//await fs.rename(file.path, path.join(__dirname, '../upload'));
