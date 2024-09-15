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
import { clearUploadsJob } from './utils/schedules';
import { clearUploads } from './utils/uploadsHandlers';
//import readline from 'node:readline';
//import { stdin, stdout } from 'node:process';

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
//app.use(errors());
app.use(dbErrorHandler, errorHandler);

clearUploadsJob;

// Слушаем 3000 порт
let server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`DB is opened on address ${DB_ADDRESS}`);
});

/*
const haltServerForced = () => {
  console.error('Force shutdown');
  db.close().then(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10 * 1000);
};

const haltServer = () => {
  server.close(() => {
    console.log('Closing connections');
    db.close().then(() => {
      console.log('Closed out database');
      process.exit(0);
    });
  });
};


const rl = readline.createInterface({ input: stdin, output: stdout });
rl.write(
  `${'\x1b[1m'}${'\x1b[36m'}type ${'\x1b[35m'}exit${'\x1b[36m'} to quit the app${'\n'}${'\x1b[0m'}`
);

rl.on('SIGINT', () => {
  rl.question('Are you sure you want to exit? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) {
      haltServer();
      setTimeout(haltServerForced, 10 * 1000);
    }
  });
});

rl.on('line', (line) => {
  // ждём данных из stdin
  //process.stdout.write(String(line));
  if (line.match(/^e(xit)?$/i)) {
    haltServer();
    setTimeout(haltServerForced, 10 * 1000);
  }
});
*/
