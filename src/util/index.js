import { format, parseISO } from 'date-fns';
import { singaporeDateTimeFormat } from './config';

const defaultPattern = singaporeDateTimeFormat.medium;

export const formatISODate = (date, formatPattern = defaultPattern) => {
  if (!date) return 'No date';
  try {
    const parsedDate = parseISO(date);
    if (parsedDate) return format(parsedDate, formatPattern);
    return date;
  } catch (e) {
    console.log(e);
  }
};
