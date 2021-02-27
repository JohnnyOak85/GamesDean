import moment, { unitOfTime } from 'moment';

const getDate = (): string => moment().format('Do MMMM YYYY, h:mm:ss a');

const getTime = (timeAmount: string): number | undefined => {
  const time = parseInt(timeAmount);

  if (time && time > 0 && time < 100 && !isNaN(time)) return time;
};

const addTime = (type: unitOfTime.DurationConstructor, amount: number): string => moment().add(type, amount).format();

export { addTime, getDate, getTime };
