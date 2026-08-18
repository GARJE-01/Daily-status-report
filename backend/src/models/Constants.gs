var ACTIONS = {
  HEALTH_CHECK: 'healthCheck',
  GET_DRAFTS: 'getDrafts',
  GET_CONFIG: 'getConfig',
  SAVE_CONFIG: 'saveConfig',
  PREVIEW_EMAIL: 'previewEmail',
  SEND_EMAIL: 'sendEmail',
  SCHEDULE_EMAIL: 'scheduleEmail',
  GET_SCHEDULED_EMAIL: 'getScheduledEmail',
  CANCEL_SCHEDULED_EMAIL: 'cancelScheduledEmail'
};

var PROPERTY_KEYS = {
  DRAFT_ID: 'draftId',
  TO: 'to',
  CC: 'cc',
  SCHEDULED_EMAIL: 'scheduledEmail'
};

var PLACEHOLDERS = {
  TODAY_DATE: '{{TODAY_DATE}}',
  TOMORROW_DATE: '{{TOMORROW_DATE}}',
  TASK_LIST: '{{TASK_LIST}}',
  PLANNED_TASK: '{{PLANNED_TASK}}'
};

var ERROR_CODES = {
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
};

