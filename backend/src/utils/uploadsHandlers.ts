import path from 'path';
import * as fs from 'node:fs/promises';
import { logger } from '../middlewares/logger';

export const moveToImages = async (fileName: string) => {
  const filePathOld = path.join(
    __dirname,
    `../public/${process.env.UPLOAD_PATH_TEMP || 'uploads'}/`,
    path.basename(fileName),
  );
  const filePathNew = path.join(
    __dirname,
    `../public/${process.env.UPLOAD_PATH || 'images'}/`,
    path.basename(fileName),
  );
  return fs.rename(filePathOld, filePathNew);
};

const clearFiles = async (folder: string) => {
  let items;
  try {
    items = await fs.readdir(folder);
  } catch (error) {
    logger.debug('during file clearing occured: ', error);
    return;
  }
  items.forEach((item) => {
    const fullPath = path.join(folder, item);
    fs.stat(fullPath).then((stat) => {
      if (stat.isDirectory()) {
        return;
      }
      fs.unlink(fullPath).then(() => {
        logger.debug('removed file', path.basename(fullPath));
      });
    });
  });
};

export const fileDestination = path.join(
  __dirname,
  `../public/${process.env.UPLOAD_PATH_TEMP || 'uploads'}/`,
);

export const clearUploads = async () => {
  clearFiles(
    path.join(
      __dirname,
      `../public/${process.env.UPLOAD_PATH_TEMP || 'uploads'}/`,
    ),
  );
};
