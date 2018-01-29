const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform != 'drawin') app.quit();
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 255,
        height: 255,
        frame: false,
        titleBarStyle: 'hidden'
    });

    mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.setAlwaysOnTop(true);
});
