import moment from 'moment';

const getDate = () => moment().format('Do MMMM YYYY, h:mm:ss a');

const getTime = (timeAmount: string) => {
  const time = parseInt(timeAmount);

  if (time && time > 0 && time < 100 && !isNaN(time)) return time;
};

export { getDate, getTime };
