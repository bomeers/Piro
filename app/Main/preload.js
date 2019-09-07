// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  var appVersion = require('electron').remote.app.getVersion();
  document.getElementById('version').innerText = appVersion;

  const {
    ipcRenderer
  } = require('electron');
  ipcRenderer.on('message', function (event, text) {
    var container = document.getElementById('messages');
    var message = document.createElement('div');
    message.innerHTML = text;
    container.appendChild(message);
  })

  // Master Page - Header
  // Will update later to support offline usage
  const loadJQuery = document.createElement("script");
  loadJQuery.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
  loadJQuery.type = 'text/javascript';
  document.body.appendChild(loadJQuery);
})