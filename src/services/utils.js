export const convertDateToUnix = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

export const convertUnixToDate = (unixTimestamp) => {
  return new Date(unixTimestamp * 1000).toISOString().split('T')[0]; // formato 'YYYY-MM-DD'
};
