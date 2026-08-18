function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateConfigInput(config) {
  var errors = [];

  if (!config || !isNonEmptyString(config.draftId)) {
    errors.push('Please select a Gmail draft.');
  }

  if (!config || !isNonEmptyString(config.to)) {
    errors.push('Please enter at least one TO recipient.');
  }

  return errors;
}

function validateReportInput(input) {
  var errors = [];

  if (!input || !isNonEmptyString(input.taskList)) {
    errors.push("Please enter today's activities.");
  }

  return errors;
}

function validateScheduleInput(input) {
  var errors = [];

  if (!input || !input.scheduledAt) {
    errors.push('Please specify a scheduled date and time.');
  } else {
    var schedDate = new Date(input.scheduledAt);
    if (isNaN(schedDate.getTime())) {
      errors.push('Invalid schedule date/time format.');
    } else if (schedDate.getTime() <= Date.now() + 30000) {
      errors.push('Scheduled time must be in the future.');
    }
  }

  if (!isNonEmptyString(input.body)) {
    errors = errors.concat(validateReportInput(input));
  }

  return errors;
}
