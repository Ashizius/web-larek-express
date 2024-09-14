//index.ts:
import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/products';
import orderRouter from './routes/orders';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';
import cors from 'cors';
import { errors } from 'celebrate';
import { dbErrorHandler, errorHandler } from './middlewares/errorHandler';
import { errorLogger, requestLogger } from './middlewares/logger';
import cookieParser from 'cookie-parser';
import { clearUploadsJob } from './utils/clearUpload';

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } =
  process.env;

mongoose.connect(DB_ADDRESS); // подключаемся к серверу MongoDB
const db = mongoose.connection;

const app = express();

var corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
//app.use(cors());
/*var whitelist = ['http://localhost:5173'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}*/

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: 60 * 60 * 1000,
  })
);

app.use(requestLogger);

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

app.use(errorLogger);
app.use(errors());
app.use(dbErrorHandler);
app.use(errorHandler);

clearUploadsJob.start();

// Слушаем 3000 порт
let server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`DB is opened on address ${DB_ADDRESS}`);
});
/*
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Closing connections');
    db.close().then(() => {
      console.log('Closed out database');
      process.exit(0);
    });
  });
});

process.stdin.on('data', (data) => {
  // ждём данных из stdin
  process.stdout.write(String(data));
  if (String(data) === 'exit\n') {
    setTimeout(() => {
      console.error('Force shutdown');
      db.close().then(() => {
        process.exit(1);
      });
    }, 10 * 1000);
    server.close(() => {
      console.log('Closing connections');
      db.close().then(() => {
        console.log('Closed out database');
        process.exit(0);
      });
    });
  }
});
*/
/*
npm run dev
# В терминале окажется сообщение "App listening on Port 3000"
Перейдём в браузере по адресу http://localhost:3000. Мы видим сообщение «Cannot GET /». Это означает, что express запущен и работает на порте 3000, просто пока ему нечего нам отдать.
*/
