/*
npm i --save multer
npm i --save-dev @types/multer 
*/
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.diskStorage({
  destination:  '/uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ dest: 'uploads/' ,fileSize: 1E6});

export const fileMiddleware = upload.single('file');


/*
app.post('/img', upload.single('avatar'), (req: Request, res: Response) => {
  console.log(req.file); // Тут будет файл
  console.log(req.body); // Тут будет прочее боди
  res.send('ok');
}); */