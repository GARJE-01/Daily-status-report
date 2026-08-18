function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function linesToHtml(text) {
  return escapeHtml(text).replace(/\r?\n/g, '<br>');
}
