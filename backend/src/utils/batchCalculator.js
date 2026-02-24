const { getWeekNumber, getDayName } = require('./dateUtils');

const BATCH_SCHEDULE = {
  batch1: {
    week1: ['Monday', 'Tuesday', 'Wednesday'],
    week2: ['Thursday', 'Friday'],
  },
  batch2: {
    week1: ['Thursday', 'Friday'],
    week2: ['Monday', 'Tuesday', 'Wednesday'],
  },
};

const isEmployeeWorkingDay = (date, batch) => {
  const dayName = getDayName(date);
  const weekNumber = getWeekNumber(date) % 2 === 0 ? 'week2' : 'week1';
  
  const schedule = BATCH_SCHEDULE[batch];
  return schedule && schedule[weekNumber] && schedule[weekNumber].includes(dayName);
};

const getEmployeeBatch = (employee) => {
  return employee.batch;
};

const isEmployeeAvailable = (date, batch) => {
  return isEmployeeWorkingDay(date, batch);
};

const getCurrentBatchWeek = (date) => {
  const weekNumber = getWeekNumber(date);
  return weekNumber % 2 === 0 ? 'week2' : 'week1';
};

module.exports = {
  isEmployeeWorkingDay,
  getEmployeeBatch,
  isEmployeeAvailable,
  getCurrentBatchWeek,
  BATCH_SCHEDULE,
};
