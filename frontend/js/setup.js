// Setup screen: pick a Gmail draft, enter recipients, save configuration.
// Also reachable from the Report screen to change an existing configuration.

function renderSetupScreen() {
  return Api.getConfig().then(function (configResponse) {
    var existingConfig = configResponse.success ? configResponse.data : null;

    return loadPartial('components/setup.html').then(function (html) {
      mount(html);
      applyExistingConfig(existingConfig);
      return populateDraftOptions(existingConfig);
    });
  }).then(function () {
    qs('#save-config-btn').addEventListener('click', handleSaveConfig);
  });
}

function applyExistingConfig(config) {
  if (!config) {
    return;
  }

  qs('#setup-screen h1').textContent = 'Update Configuration';
  qs('.screen-subtitle').textContent = 'Change your Gmail draft or recipients.';
  qs('#to-input').value = config.to || '';
  qs('#cc-input').value = config.cc || '';
}

function populateDraftOptions(existingConfig) {
  return Api.getDrafts().then(function (response) {
    var select = qs('#draft-select');

    if (!response.success) {
      showToast(response.error.message, true);
      return;
    }

    response.data.drafts.forEach(function (draft) {
      var option = document.createElement('option');
      option.value = draft.id;
      option.textContent = draft.subject;

      if (existingConfig && existingConfig.draftId === draft.id) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  });
}

function handleSaveConfig() {
  var config = {
    draftId: qs('#draft-select').value,
    to: qs('#to-input').value.trim(),
    cc: qs('#cc-input').value.trim()
  };

  showLoading();

  Api.saveConfig(config)
    .then(function (response) {
      if (!response.success) {
        showToast(response.error.message, true);
        return;
      }

      showToast(response.message);
      return renderReportScreen();
    })
    .catch(function (error) {
      showToast(error.message, true);
    })
    .then(function () {
      hideLoading();
    });
}
