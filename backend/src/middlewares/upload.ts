/*
npm i --save multer
npm i --save-dev @types/multer
*/
import multer from 'multer';
import path from 'path';

/*
const storage = multer.diskStorage({
  destination:  '/uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})*/

const destination = path.join(__dirname, '../public/uploads/');
console.log(destination);

const upload = multer({ dest:  destination, limits: { fileSize: 10E6 }});

export const fileMiddleware = upload.single('file');


/*
app.post('/img', upload.single('avatar'), (req: Request, res: Response) => {
  console.log(req.file); // Тут будет файл
  console.log(req.body); // Тут будет прочее боди
  res.send('ok');
}); */