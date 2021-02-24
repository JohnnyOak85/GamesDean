import moment from 'moment';

const getDate = () => {
  return moment().format('Do MMMM YYYY, h:mm:ss a');
};

export { getDate };
