import moment, { unitOfTime } from 'moment';

/**
 * @description Returns the current date.
 */
const getDate = (): string => moment().format('Do MMMM YYYY, h:mm:ss a');

/**
 * @description Returns a timestamp from the current date until the amount and type of time given.
 * @param type
 * @param amount
 */
const addTime = (type: unitOfTime.DurationConstructor, amount: number): string => moment().add(amount, type).format();

export { addTime, getDate };
