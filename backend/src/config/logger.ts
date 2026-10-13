import winston from 'winston';
import { env } from './env';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  silent: env.NODE_ENV === 'test',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json()),
  defaultMeta: { service: 'fotos-profissionais-ia-api' },
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === 'production' ? combine(timestamp(), json()) : combine(colorize(), simple()),
    }),
  ],
});
