// App entry point: boots shared chrome (loading overlay, toast) then routes to a screen.

document.addEventListener('DOMContentLoaded', function () {
  Promise.all([
    loadPartial('components/loading.html'),
    loadPartial('components/toast.html')
  ]).then(function (parts) {
    document.body.insertAdjacentHTML('beforeend', parts[0]);
    document.body.insertAdjacentHTML('beforeend', parts[1]);

    return routeToScreen();
  }).catch(function (error) {
    mount('<p class="error-text">Failed to start the app: ' + error.message + '</p>');
  });
});

function routeToScreen() {
  showLoading();

  return Api.getConfig()
    .then(function (response) {
      if (response.success && response.data) {
        return renderReportScreen();
      }
      return renderSetupScreen();
    })
    .catch(function (error) {
      mount('<p class="error-text">Could not reach the backend: ' + error.message + '</p>');
    })
    .then(function () {
      hideLoading();
    });
}
