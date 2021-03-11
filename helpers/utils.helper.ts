// Dependencies
import moment, { unitOfTime } from 'moment';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.printf((log) => `[${log.level.toUpperCase()}] - ${log.message}`),
  defaultMeta: { service: 'user-service' },
  transports: [new transports.File({ filename: 'logs/log.txt' })]
});

/**
 * @description Returns a timestamp from the current date until the amount and type of time given.
 * @param type
 * @param amount
 */
const addTime = (type: unitOfTime.DurationConstructor, amount: number): string => moment().add(amount, type).format();

/**
 * @description Returns the current date.
 */
const getDate = (date = new Date(), format = 'Do MMMM YYYY, h:mm:ss a'): string => moment(date).format(format);

/**
 * @description Transforms the given number string into a number.
 * @param amount
 */
const getNumber = (amount: string): number | undefined => {
  const number = parseInt(amount);

  if (number && number > 0 && number < 100 && !isNaN(number)) return number;
};

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

export { addTime, getDate, getNumber, logError, logInfo };
