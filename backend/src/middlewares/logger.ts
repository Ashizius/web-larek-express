import {createLogger, transports, format} from 'winston';
import { Request, Response, NextFunction } from 'express';
import expressWinston from 'express-winston'

export const requestLogger = expressWinston.logger({
  transports: [
    new transports.File({ filename: 'request.log' }),
  ],
  format: format.json(),
});

// логгер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [new transports.File({ filename: 'error.log' })],
  format: format.json(),
});

//дебаггер
export const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [],
});

if (process.env.NODE_ENV !== 'production') {
  // Добавляет транспорт с консолью в логгер для отладочной сборки
  logger.add(
    new transports.Console({
      format: format.combine(
        format.simple(),
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      ),
      level: 'debug',
    })
  );
}

export const showReqBody =( req: Request, res: Response, next: NextFunction) =>{
  logger.debug(req.url,req.body);
  next();
}