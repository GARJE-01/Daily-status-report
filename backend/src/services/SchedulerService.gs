function scheduleEmail(payload) {
  var config = getSavedConfigOrThrow();
  var errors = validateScheduleInput(payload);

  if (errors.length > 0) {
    return createErrorObject(ERROR_CODES.VALIDATION_ERROR, errors.join(' '));
  }

  var email;
  if (isNonEmptyString(payload.body)) {
    email = { subject: payload.subject || '', body: payload.body };
  } else {
    email = buildEmailFromDraft(config.draftId, payload);
  }

  // Clear any existing schedule triggers & stored data
  deleteScheduledTriggers();

  var scheduledDate = new Date(payload.scheduledAt);
  var trigger = ScriptApp.newTrigger('processScheduledEmail')
    .timeBased()
    .at(scheduledDate)
    .create();

  var scheduledData = {
    subject: email.subject,
    body: email.body,
    to: config.to,
    cc: config.cc || '',
    scheduledAt: scheduledDate.toISOString(),
    triggerId: trigger.getUniqueId()
  };

  PropertiesService.getUserProperties().setProperty(
    PROPERTY_KEYS.SCHEDULED_EMAIL,
    JSON.stringify(scheduledData)
  );

  return createSuccessResponse(
    { scheduledAt: scheduledData.scheduledAt, subject: scheduledData.subject },
    'Email scheduled successfully for ' + formatDate(scheduledDate) + '.'
  );
}

function getScheduledEmail() {
  var rawData = PropertiesService.getUserProperties().getProperty(PROPERTY_KEYS.SCHEDULED_EMAIL);

  if (!rawData) {
    return createSuccessResponse(null, 'No scheduled email.');
  }

  try {
    var data = JSON.parse(rawData);
    var schedTime = new Date(data.scheduledAt).getTime();

    // If schedule time has already passed, treat as no active schedule
    if (schedTime <= Date.now() - 3600000) {
      deleteScheduledTriggers();
      PropertiesService.getUserProperties().deleteProperty(PROPERTY_KEYS.SCHEDULED_EMAIL);
      return createSuccessResponse(null, 'No scheduled email.');
    }

    return createSuccessResponse(
      { scheduledAt: data.scheduledAt, subject: data.subject },
      'Scheduled email found.'
    );
  } catch (err) {
    return createSuccessResponse(null, 'No scheduled email.');
  }
}

function cancelScheduledEmail() {
  deleteScheduledTriggers();
  PropertiesService.getUserProperties().deleteProperty(PROPERTY_KEYS.SCHEDULED_EMAIL);
  return createSuccessResponse(null, 'Scheduled email canceled successfully.');
}

function deleteScheduledTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'processScheduledEmail') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

// Top-level function invoked by Apps Script time-driven trigger
function processScheduledEmail(e) {
  var userProps = PropertiesService.getUserProperties();
  var rawData = userProps.getProperty(PROPERTY_KEYS.SCHEDULED_EMAIL);

  if (rawData) {
    try {
      var data = JSON.parse(rawData);
      if (data && data.to && data.subject && data.body) {
        GmailApp.sendEmail(data.to, data.subject, '', {
          cc: data.cc || '',
          htmlBody: data.body
        });
      }
    } catch (err) {
      console.error('Error sending scheduled email:', err);
    } finally {
      userProps.deleteProperty(PROPERTY_KEYS.SCHEDULED_EMAIL);
    }
  }

  deleteScheduledTriggers();
}
