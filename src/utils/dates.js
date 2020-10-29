export function isTimeContainedInDate(dateStrOrDate, time) {
  const date = typeof dateStrOrDate === 'string' ? new Date(dateStrOrDate) : dateStrOrDate;
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59);
  return (date.getTime() <= time && time <= endOfDay.getTime());
}

export function dateString(date) {
  const d = date.getDate();
  const m = date.getMonth() + 1;

  return `${date.getFullYear()}-${m >= 10 ? m : `0${m}`}-${d >= 10 ? d : `0${d}`}`;
}

export function dayFullName(day) {
  switch (day) {
    case 'Mon':
      return 'Monday';
    case 'Tue':
      return 'Tuesday';
    case 'Wed':
      return 'Wednesday';
    case 'Thu':
      return 'Thursday';
    case 'Fri':
      return 'Friday';
    case 'Sat':
      return 'Saturday';
    case 'Sun':
      return 'Sunday';
    default:
      return day;
  }
}

export function minutesToAdd() {
  return new Date().getTimezoneOffset() * -1;
}

export function historyDateToLocalDate(date) {
  return new Date(new Date(date).getTime() + (minutesToAdd() * 60000));
}
