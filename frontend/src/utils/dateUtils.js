import { format, startOfWeek, addDays, getWeek } from "date-fns";

export const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");

export const formatDisplay = (date) => format(new Date(date), "MMM dd, yyyy");

export const getWeekDays = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const getWeekNumber = (date) => getWeek(new Date(date));

export const isWeekEven = (date) => getWeekNumber(date) % 2 === 0;

export const getBatchWorkingDays = (date, batch) => {
  const weekType = isWeekEven(date) ? "week2" : "week1";
  const schedule = {
    batch1: { week1: [1, 2, 3], week2: [4, 5] },
    batch2: { week1: [4, 5], week2: [1, 2, 3] },
  };
  return schedule[batch]?.[weekType] || [];
};

export const isWorkingDay = (date, batch) => {
  const dayOfWeek = new Date(date).getDay();
  return getBatchWorkingDays(date, batch).includes(dayOfWeek);
};

export const getDayLabel = (date) => format(new Date(date), "EEE");
export const getDayNumber = (date) => format(new Date(date), "dd");
export const getMonthYear = (date) => format(new Date(date), "MMMM yyyy");
