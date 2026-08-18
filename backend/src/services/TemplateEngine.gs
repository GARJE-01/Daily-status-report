var DEFAULT_PLANNED_TASK = 'Continue pending activities.';

function renderTemplate(templateHtml, data) {
  return templateHtml
    .split(PLACEHOLDERS.TODAY_DATE).join(escapeHtml(data.todayDate))
    .split(PLACEHOLDERS.TOMORROW_DATE).join(escapeHtml(data.tomorrowDate))
    .split(PLACEHOLDERS.TASK_LIST).join(formatTaskList(data.taskList))
    .split(PLACEHOLDERS.PLANNED_TASK).join(formatPlannedTask(data.plannedTask));
}

// "Monitor Email\nConfigured VLAN" -> "1) Monitor Email<br><br>2) Configured VLAN"
function formatTaskList(text) {
  var lines = String(text || '')
    .split(/\r?\n/)
    .map(function (line) { return line.trim(); })
    .filter(function (line) { return line.length > 0; });

  return lines
    .map(function (line, index) { return (index + 1) + ') ' + escapeHtml(line); })
    .join('<br><br>');
}

function formatPlannedTask(text) {
  var trimmed = String(text || '').trim();
  return trimmed ? linesToHtml(trimmed) : escapeHtml(DEFAULT_PLANNED_TASK);
}
