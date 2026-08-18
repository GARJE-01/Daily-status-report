// Report screen: enter today's work, preview the rendered email, and send it.

function renderReportScreen() {
  return loadPartial('components/report.html').then(function (html) {
    mount(html);
    qs('#today-date-input').value = getDefaultTodayText();
    qs('#tomorrow-date-input').value = getDefaultTomorrowText();
    qs('#preview-btn').addEventListener('click', handlePreview);
    qs('#send-btn').addEventListener('click', handleSend);
    qs('#edit-config-btn').addEventListener('click', function () {
      renderSetupScreen();
    });
  });
}

function getReportInput() {
  return {
    todayDate: qs('#today-date-input').value.trim(),
    tomorrowDate: qs('#tomorrow-date-input').value.trim(),
    taskList: qs('#task-list-input').value.trim(),
    plannedTask: qs('#planned-task-input').value.trim()
  };
}

// Defaults to the next working day: Saturday/Sunday roll forward to Monday.
// Both fields stay editable, since "tomorrow" isn't always the right label
// (weekends, holidays, etc.).
function getDefaultTodayText() {
  return formatDisplayDate(new Date());
}

function getDefaultTomorrowText() {
  var date = new Date();
  date.setDate(date.getDate() + 1);

  var dayOfWeek = date.getDay();
  if (dayOfWeek === 6) {
    date.setDate(date.getDate() + 2);
  } else if (dayOfWeek === 0) {
    date.setDate(date.getDate() + 1);
  }

  return formatDisplayDate(date);
}

function formatDisplayDate(date) {
  var day = String(date.getDate()).padStart(2, '0');
  var month = String(date.getMonth() + 1).padStart(2, '0');
  return day + '-' + month + '-' + date.getFullYear();
}

function handlePreview() {
  showLoading();

  Api.previewEmail(getReportInput())
    .then(function (response) {
      if (!response.success) {
        showToast(response.error.message, true);
        return;
      }
      return showPreviewModal(response.data);
    })
    .catch(function (error) {
      showToast(error.message, true);
    })
    .then(function () {
      hideLoading();
    });
}

function handleSend() {
  showLoading();

  Api.sendEmail(getReportInput())
    .then(function (response) {
      if (!response.success) {
        showToast(response.error.message, true);
        return;
      }
      showToast(response.message);
    })
    .catch(function (error) {
      showToast(error.message, true);
    })
    .then(function () {
      hideLoading();
    });
}

function showPreviewModal(email) {
  return loadPartial('components/preview-modal.html').then(function (html) {
    document.body.insertAdjacentHTML('beforeend', html);

    var bodyFrame = qs('#preview-body');

    qs('#preview-subject').value = email.subject;

    bodyFrame.addEventListener('load', function () {
      bodyFrame.contentDocument.body.contentEditable = 'true';
    });
    bodyFrame.srcdoc = email.body;

    qs('#preview-close-btn').addEventListener('click', closePreviewModal);
    qs('#preview-send-btn').addEventListener('click', handleSendFromPreview);
  });
}

function handleSendFromPreview() {
  var bodyFrame = qs('#preview-body');
  var subject = qs('#preview-subject').value.trim();
  var body = bodyFrame.contentDocument.body.innerHTML;

  closePreviewModal();
  sendRenderedEmail(subject, body);
}

function sendRenderedEmail(subject, body) {
  showLoading();

  Api.sendEmail({ subject: subject, body: body })
    .then(function (response) {
      if (!response.success) {
        showToast(response.error.message, true);
        return;
      }
      showToast(response.message);
    })
    .catch(function (error) {
      showToast(error.message, true);
    })
    .then(function () {
      hideLoading();
    });
}

function closePreviewModal() {
  var modal = qs('#preview-modal');
  if (modal) {
    modal.remove();
  }
}
