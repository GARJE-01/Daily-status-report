function getConfigProperties() {
  var props = PropertiesService.getUserProperties();

  return {
    draftId: props.getProperty(PROPERTY_KEYS.DRAFT_ID),
    to: props.getProperty(PROPERTY_KEYS.TO),
    cc: props.getProperty(PROPERTY_KEYS.CC)
  };
}

function saveConfigProperties(config) {
  var properties = {};
  properties[PROPERTY_KEYS.DRAFT_ID] = config.draftId;
  properties[PROPERTY_KEYS.TO] = config.to;
  properties[PROPERTY_KEYS.CC] = config.cc || '';

  PropertiesService.getUserProperties().setProperties(properties, true);
}
