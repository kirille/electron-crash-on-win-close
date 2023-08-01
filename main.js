'use strict'  

// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nativeWindowOpen: true,
      contextIsolation: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.webContents.setWindowOpenHandler( ({ url, frameName, features }) => {
    if ( !features?.includes('_OWTag') ) {
      return {action: 'deny'};
    }
    
    mainWindow.webContents.once('did-create-window', (childWindow ) => {
      console.log('did-create overlay window', { obj: this });
      childWindow._OWTag = true;
    });

    let options = {
      action: 'allow',
      overrideBrowserWindowOptions: {
        focusable: true,
        show: true,
        acceptFirstMouse: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: false
        },
      }
    };
    return options;
  } );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const { crashReporter } = require('electron');
crashReporter.start({ uploadToServer: false });

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
