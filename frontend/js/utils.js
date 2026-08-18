// Shared DOM/frontend helpers.

function qs(selector, root) {
  return (root || document).querySelector(selector);
}

function loadPartial(path) {
  return fetch(path).then(function (response) {
    if (!response.ok) {
      throw new Error('Failed to load ' + path);
    }
    return response.text();
  });
}

function mount(html) {
  qs('#app').innerHTML = html;
}

function showLoading() {
  qs('#loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  qs('#loading-overlay').classList.add('hidden');
}

function showToast(message, isError) {
  var toast = qs('#toast');
  toast.textContent = message;
  toast.classList.toggle('toast-error', !!isError);
  toast.classList.remove('hidden');
  toast.classList.add('toast-visible');

  window.setTimeout(function () {
    toast.classList.remove('toast-visible');
    toast.classList.add('hidden');
  }, 3000);
}
