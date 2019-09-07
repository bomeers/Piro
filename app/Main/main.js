const {
  app,
  BrowserWindow
} = require('electron');
const path = require('path');
const log = require('electron-log');
const {
  autoUpdater
} = require("electron-updater");


// ---------------------------------------------------------
//  Logging
// ---------------------------------------------------------

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
log.info('Connect to Wi-Fi to check for updates')


//-------------------------------------------------------------------
// Open a window that displays the version
//-------------------------------------------------------------------

let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

function createDefaultWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile("app/Home/index.html");
  // win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', function () {
  createDefaultWindow();
  autoUpdater.checkForUpdates();
});
app.on('window-all-closed', () => {
  app.quit()
});


//-------------------------------------------------------------------
// Check for updates
//-------------------------------------------------------------------

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall();
});