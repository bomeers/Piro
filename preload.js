// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  // Master Page - Header
  const loadJQuery = document.createElement("script");
  loadJQuery.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
  loadJQuery.type = 'text/javascript';
  document.body.appendChild(loadJQuery);

  // Master Page - Navbar

})