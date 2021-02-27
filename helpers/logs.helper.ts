import { createLogger, format, transports } from 'winston';
import { getDate } from './time.helper';

/**
 * @description Creates a new logger entity.
 */
const logger = createLogger({
  level: 'info',
  format: format.printf((log) => `[${log.level.toUpperCase()}] - ${log.message}`),
  defaultMeta: { service: 'user-service' },
  transports: [new transports.File({ filename: 'logs/log.txt' })]
});

/**
 * @description Logs an error entry.
 * @param error
 */
const logError = (error: Error): void => {
  console.log(error);
  logger.log('error', `${error.message}\n${error}\nTime: ${getDate()}`);
};

/**
 * @description Logs an information entry.
 * @param message
 */
const logInfo = (message: string): void => {
  logger.log('info', `${message}\nTime: ${getDate()}`);
};

export { logError, logInfo };
