import { Request, Response, NextFunction } from 'express';

import products from '../models/products';
import { logger } from '../middlewares/logger';
import { pauseUploadsClear, resumeUploadsClear } from '../utils/clearUpload';
//import { getDirname } from '../utils/getDirname';
import path from 'path';
import * as fs from 'node:fs/promises'

//const __dirname = getDirname(import.meta.url);

export function getProduct(req: Request, res: Response) {
  //console.log('getProduct by ',req.ip);
  return products
    .find({})
    .then((items) => res.status(200).send({ items: items }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  logger.debug('createProduct', req.body);
  const { description, image, title, category, price } = req.body;
  image.filename = path.basename(image.fileName);
  pauseUploadsClear();
  let item;
  try {
    await fs.rename(path.join(__dirname, '../upload', path.basename(image.fileName)), path.join(__dirname, '../images', path.basename(image.fileName)))
    item = await products.create({ description, image, title, category, price })
    res.status(201).send(item);
  } catch (error) {
    return next(error);
  }
  finally {
    resumeUploadsClear();
  }
}


export async function editProduct(req: Request, res: Response, next: NextFunction) {
  logger.debug('editProduct', req.body);
  const { _id, ...other } = req.body;
  let item;
  try {
    if (other.image.filename) {
      pauseUploadsClear();
      await fs.rename(path.join(__dirname, '../upload', path.basename(other.image.fileName)), path.join(__dirname, '../images', path.basename(other.image.fileName)))
    }
    item = await products.findByIdAndUpdate(_id, other)
    res.status(201).send(item);
  } catch (error) {
    return next(error);
  }
  finally {
    if (other.image.filename) {
      resumeUploadsClear();
    }
  }
}


//await fs.rename(file.path, path.join(__dirname, '../upload'));