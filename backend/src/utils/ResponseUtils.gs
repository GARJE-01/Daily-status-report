function createSuccessResponse(data, message) {
  return {
    success: true,
    data: data,
    message: message || ''
  };
}

function createErrorObject(code, message) {
  return {
    success: false,
    error: {
      code: code,
      message: message
    }
  };
}
