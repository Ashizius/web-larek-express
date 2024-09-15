import { Request, Response, NextFunction } from 'express';
import * as fs from 'node:fs/promises';
import path from 'path';
import BadRequestError from '../errors/badRequestError';
import { logger } from '../middlewares/logger';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;
  if (!file) {
    return next(new BadRequestError('Нет файла!'));
  }
  logger.debug(
    'uploaded File: ',
    path.basename(file.path) + path.basename(file.path),
  );
  const uniqueName = file.path + path.extname(file.originalname);
  try {
    await fs.rename(file.path, uniqueName);
  } catch (error) {
    return next(error);
  }
  return res.send({
    fileName: `/images/${path.basename(uniqueName)}`,
    originalName: path.basename(file.originalname),
  });
};

export default uploadFile;
