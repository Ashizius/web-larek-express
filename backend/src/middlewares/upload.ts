import multer from 'multer';
import { Request, Express } from 'express';
import { fileDestination } from '../utils/uploadsHandlers';
import BadRequestError from '../errors/badRequestError';

const acceptableImages = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
];

const fileFilterConfig = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (acceptableImages.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('неправильный тип файла'));
  }
};

const upload = multer({
  dest: fileDestination,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 1e6 },
  fileFilter: fileFilterConfig,
});

const fileMiddleware = upload.single('file');
export default fileMiddleware;
