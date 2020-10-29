import { isTimeContainedInDate, historyDateToLocalDate } from '@/utils/dates';

export function habitHistory(habit, today) {
  return habit.history
    .map(({ done, date }) => {
      const historyDate = historyDateToLocalDate(date);
      const isToday = isTimeContainedInDate(historyDate, today);
      const highlight = { fillMode: 'light' };
      const key = date;

      if (done) { // done
        highlight.color = 'green';
      } else if (isToday && !done) { // today
        highlight.color = 'gray';
      } else if (today <= historyDate) { // upcoming
        highlight.color = 'gray';
      } else { // missed
        highlight.color = 'red';
      }

      return isToday ? { dates: historyDate, key, dot: highlight } : { dates: historyDate, key, highlight };
    });
}
