// Client for the Apps Script backend Web App (single JSON-RPC style endpoint).
var APP_CONFIG = {
  // Replace with your deployed Apps Script Web App URL (Deploy > New deployment > Web app).
  BACKEND_URL: 'https://script.google.com/macros/s/AKfycbxZUGul2fKTNbTx3g1ZXaqRwavM145vZPdOyyqH3J8IEzXbw-KWb9YcclyIiMq9_9RNZw/exec'
};
//https://script.google.com/macros/s/AKfycbxZUGul2fKTNbTx3g1ZXaqRwavM145vZPdOyyqH3J8IEzXbw-KWb9YcclyIiMq9_9RNZw/exec
function callBackend(action, payload) {
  var body = new URLSearchParams();
  body.set('data', JSON.stringify({ action: action, payload: payload || {} }));

  return fetch(APP_CONFIG.BACKEND_URL, {
    method: 'POST',
    body: body
  }).then(function (response) {
    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }
    return response.json();
  });
}

var Api = {
  healthCheck: function () {
    return callBackend('healthCheck');
  },
  getDrafts: function () {
    return callBackend('getDrafts');
  },
  getConfig: function () {
    return callBackend('getConfig');
  },
  saveConfig: function (config) {
    return callBackend('saveConfig', config);
  },
  previewEmail: function (report) {
    return callBackend('previewEmail', report);
  },
  sendEmail: function (report) {
    return callBackend('sendEmail', report);
  }
};
