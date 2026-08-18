function getConfig() {
  var config = getConfigProperties();

  if (!config.draftId) {
    return createSuccessResponse(null, 'No configuration saved yet.');
  }

  return createSuccessResponse(config, 'Configuration loaded successfully.');
}

function saveConfig(input) {
  var errors = validateConfigInput(input);

  if (errors.length > 0) {
    return createErrorObject(ERROR_CODES.VALIDATION_ERROR, errors.join(' '));
  }

  saveConfigProperties(input);

  return createSuccessResponse(null, 'Configuration saved successfully.');
}

function getSavedConfigOrThrow() {
  var config = getConfigProperties();

  if (!config.draftId || !config.to) {
    throw new Error('Please complete setup before previewing or sending a report.');
  }

  return config;
}
