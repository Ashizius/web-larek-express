import { Request, Response, NextFunction } from 'express';
import * as fs from 'node:fs/promises';
import BadRequestError from '../errors/badRequestError';
import path from 'path';
import File from 'multer';
import { logger } from '../middlewares/logger';
//import { getDirname } from '../utils/getDirname';

//const __dirname = getDirname(import.meta.url);

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.file);
  const file = req.file;
  if (!file) {
    return next(new BadRequestError('Нет файла!'));
  }
  logger.debug('uploaded File: ', path.basename(file.path)+path.basename(file.path));
  /*const uniqueName =
    Date.now() +
    Math.round(Math.random() * 1e9) +
    path.extname(file.originalname);*/
    const uniqueName =
    file.path +
    path.extname(file.originalname);
  try {
    await fs.rename(file.path, uniqueName);
  } catch (error) {
    return next(error);
  }
  res.send({
    fileName: `/images/${path.basename(uniqueName)}`,
    originalName: path.basename(file.originalname),
  });
};
