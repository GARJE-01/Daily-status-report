// Entry point for the frontend, called via google.script.run.
function runAction(action, payload) {
  return dispatch({ action: action, payload: payload });
}

function dispatch(request) {
  switch (request.action) {

    case ACTIONS.HEALTH_CHECK:
      return healthCheckController();

    case ACTIONS.GET_DRAFTS:
      return getDraftsController();

    case ACTIONS.GET_CONFIG:
      return getConfigController();

    case ACTIONS.SAVE_CONFIG:
      return saveConfigController(request.payload);

    case ACTIONS.PREVIEW_EMAIL:
      return previewEmailController(request.payload);

    case ACTIONS.SEND_EMAIL:
      return sendEmailController(request.payload);

    case ACTIONS.SCHEDULE_EMAIL:
      return scheduleEmailController(request.payload);

    case ACTIONS.GET_SCHEDULED_EMAIL:
      return getScheduledEmailController();

    case ACTIONS.CANCEL_SCHEDULED_EMAIL:
      return cancelScheduledEmailController();

    default:
      return createErrorObject(
        ERROR_CODES.UNKNOWN_ACTION,
        'Unknown action.'
      );
  }
}
