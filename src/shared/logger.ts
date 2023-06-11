import { createLogger, format, Logger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, label, printf } = format;

// custom log format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date: Date = new Date(timestamp);
  const hour: number = date.getHours();
  const minutes: number = date.getMinutes();
  return `${date.toDateString()} ${hour}:${minutes} [${label}] ${level}: ${message}`;
});

export const logger: Logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'Auth service' }), timestamp(), myFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'infos',
        'auth-service-%DATE%.log'
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export const errorLogger: Logger = createLogger({
  level: 'error',
  format: combine(label({ label: 'Auth service' }), timestamp(), myFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'auth-service-%DATE%.log'
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});
