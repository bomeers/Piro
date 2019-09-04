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


//-------------------------------------------------------------------
// Define the menu
//-------------------------------------------------------------------
// let template = []
// if (process.platform === 'darwin') {
//   // OS X
//   const name = app.getName();
//   template.unshift({
//     label: name,
//     submenu: [{
//         label: 'About ' + name,
//         role: 'about'
//       },
//       {
//         label: 'Quit',
//         accelerator: 'Command+Q',
//         click() {
//           app.quit();
//         }
//       },
//     ]
//   })
// }


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
  win.loadFile("src/Home/index.html");
  // win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}

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
});

app.on('ready', createDefaultWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});


//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify();
});


//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//-------------------------------------------------------------------
// app.on('ready', function () {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {})
// autoUpdater.on('update-available', (info) => {})
// autoUpdater.on('update-not-available', (info) => {})
// autoUpdater.on('error', (err) => {})
// autoUpdater.on('download-progress', (progressObj) => {})
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();
// })