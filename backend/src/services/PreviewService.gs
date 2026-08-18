function previewEmail(reportInput) {
  var errors = validateReportInput(reportInput);

  if (errors.length > 0) {
    return createErrorObject(ERROR_CODES.VALIDATION_ERROR, errors.join(' '));
  }

  var config = getSavedConfigOrThrow();
  var email = buildEmailFromDraft(config.draftId, reportInput);

  return createSuccessResponse(email, 'Preview generated successfully.');
}
