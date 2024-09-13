import { Request, Response, NextFunction } from 'express';
import * as fs from 'node:fs/promises';
import BadRequestError from '../errors/badRequestError';
import path from 'path';
import File from 'multer';
//import { getDirname } from '../utils/getDirname';

//const __dirname = getDirname(import.meta.url);

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  if (!file) {
    return next(new BadRequestError('Нет файла!'));
  }
  const uniqueName =
    Date.now() +
    '-' +
    Math.round(Math.random() * 1e9) +
    path.extname(file.path);
  try {
    await fs.rename(file.path, path.join(__dirname, '../upload') + uniqueName);
  } catch (error) {
    return next(error);
  }
  res.send({
    fileName: `/images/${uniqueName}`,
    originalName: path.basename(file.path),
  });
};
