import { ErrorEvent } from 'discord.js';
import { createLogger, format, transports } from 'winston';
import { getDate } from './time.helper';

const logger = createLogger({
  level: 'info',
  format: format.printf(
    (log) => `[${log.level.toUpperCase()}] - ${log.message}`
  ),
  defaultMeta: { service: 'user-service' },
  transports: [new transports.File({ filename: 'logs/log.txt' })],
});

const logError = (error: Error) => {
  logger.log('error', `${error.message}\n${error}\nTime: ${getDate()}`);
};

const logInfo = (message: string) => {
  logger.log('info', message);
};

export { logError, logInfo };
