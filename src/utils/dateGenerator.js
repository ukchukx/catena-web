export default function* dateGenerator({ selectedDays = [], end = null, start = new Date() }) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today.setHours(0);
  const nextDate = new Date(start);
  nextDate.setUTCHours(12, 0, 0, 0);
  if (!end) end = new Date(start.getFullYear(), 11, 31);
  end.setUTCHours(12, 0, 0, 0);

  const shouldReturn = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // True if `date` is after `today` and `date`'s day is in `selectedDays`
    return +date >= +today && selectedDays.includes(days[date.getDay()]);
  };

  if (shouldReturn(nextDate)) yield new Date(nextDate);

  while (nextDate < end) {
    nextDate.setTime(nextDate.getTime() + 86400000);

    if (shouldReturn(nextDate)) yield new Date(nextDate);
  }
}
