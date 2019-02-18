export default function* dateGenerator({ selectedDays = [], end = null, start = new Date() }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  start.setUTCHours(12, 0, 0, 0);

  const today = new Date();

  const startIsAfterToday = () => start.getTime() >= today.getTime();

  if (!end) end = new Date(start.getFullYear(), 11, 31);
  end.setUTCHours(12, 0, 0, 0);

  if (selectedDays.length && startIsAfterToday()) {
    if (selectedDays.indexOf(days[start.getDay()]) !== -1) yield start;
  }

  while (start <= end) {
    start.setDate(start.getDate() + 1);
    if (!startIsAfterToday() || (selectedDays.length && selectedDays.indexOf(days[start.getDay()]) === -1)) continue;
    yield new Date(start);
  }
}
