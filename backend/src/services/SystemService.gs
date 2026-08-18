function healthCheck() {
  return createSuccessResponse({ status: 'UP' }, 'Backend is alive.');
}
