export default function* dateGenerator(selectedDays = []) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const start = new Date();
  start.setUTCHours(12, 0, 0, 0);
  const today = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
    start.getHours(),
    start.getMinutes(),
    start.getSeconds(),
    start.getMilliseconds()
  );
  const end = new Date(start.getFullYear(), 11, 31);
  end.setUTCHours(12, 0, 0, 0);

  if (selectedDays.indexOf(days[today.getDay()]) !== -1) yield today;

  while (start <= end) {
    start.setDate(start.getDate() + 1);
    if (selectedDays.indexOf(days[start.getDay()]) === -1) continue;
    yield new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
      start.getSeconds(),
      start.getMilliseconds()
    );
  }
}
