//index.ts:
import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/products';
import orderRouter from './routes/orders';
import cors from 'cors';
import { errors } from 'celebrate';
import { errorHandler } from './middlewares/errorHandler';
import { errorLogger, requestLogger } from './middlewares/logger';


const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } =
  process.env;

mongoose.connect(DB_ADDRESS); // подключаемся к серверу MongoDB
const db = mongoose.connection;

const app = express();

app.use(cors());

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

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

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
