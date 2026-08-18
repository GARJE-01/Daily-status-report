function getDrafts() {
  var drafts = GmailApp.getDrafts();

  var draftList = drafts.map(function (draft) {
    var message = draft.getMessage();

    return {
      id: draft.getId(),
      subject: message.getSubject() || 'Untitled Draft'
    };
  });

  return createSuccessResponse({ drafts: draftList }, 'Drafts fetched successfully.');
}

function getDraftById(draftId) {
  var drafts = GmailApp.getDrafts();

  var match = drafts.filter(function (draft) {
    return draft.getId() === draftId;
  })[0];

  if (!match) {
    throw new Error('The saved Gmail draft could not be found. It may have been deleted.');
  }

  return match;
}

function buildEmailFromDraft(draftId, reportInput) {
  var draft = getDraftById(draftId);
  var message = draft.getMessage();

  var templateData = {
    todayDate: reportInput.todayDate || getTodayFormatted(),
    tomorrowDate: reportInput.tomorrowDate || getTomorrowFormatted(),
    taskList: reportInput.taskList,
    plannedTask: reportInput.plannedTask
  };

  return {
    subject: renderTemplate(message.getSubject(), templateData),
    body: renderTemplate(message.getBody(), templateData)
  };
}

function sendEmail(reportInput) {
  var config = getSavedConfigOrThrow();
  var email;

  // The Preview modal lets the user edit the rendered subject/body directly
  // (dates, wording, anything) before sending. When that's supplied, send it
  // as-is instead of re-rendering from the draft.
  if (isNonEmptyString(reportInput.body)) {
    email = { subject: reportInput.subject || '', body: reportInput.body };
  } else {
    var errors = validateReportInput(reportInput);

    if (errors.length > 0) {
      return createErrorObject(ERROR_CODES.VALIDATION_ERROR, errors.join(' '));
    }

    email = buildEmailFromDraft(config.draftId, reportInput);
  }

  GmailApp.sendEmail(config.to, email.subject, '', {
    cc: config.cc || '',
    htmlBody: email.body
  });

  return createSuccessResponse(
    { sentTo: config.to, sentAt: new Date().toISOString() },
    'Email sent successfully.'
  );
}
