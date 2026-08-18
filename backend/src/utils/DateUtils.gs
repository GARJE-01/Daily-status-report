function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd-MM-yyyy');
}

function getTodayFormatted() {
  return formatDate(new Date());
}

function getTomorrowFormatted() {
  return formatDate(getDefaultTomorrowDate());
}

// Defaults to the next working day: Saturday/Sunday roll forward to Monday.
// Only used when the request doesn't supply its own tomorrowDate.
function getDefaultTomorrowDate() {
  var date = new Date();
  date.setDate(date.getDate() + 1);

  var dayOfWeek = date.getDay();
  if (dayOfWeek === 6) {
    date.setDate(date.getDate() + 2);
  } else if (dayOfWeek === 0) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}
