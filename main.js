const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalMenu = electron.Menu;
const ipcMain = electron.ipcMain;

let mainWindow = null;

const menuTemplate = [
    {
        label: 'Sticky',
        submenu: [
            {
                label: 'Hide',
                accelerator: 'CmdOrCtrl+H',
                role: 'hide'
            },
            {
                label: 'close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
            {
                label: 'quit',
                accelerator: 'CmdOrCtrl+Q',
                role: 'quit'
            }
        ]
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'New Window',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    createNewWindow();
                }
            }
        ]
    }
];


app.on('window-all-closed', () => {
    if (process.platform != 'drawin') app.quit();
});

app.on('ready', () => {
    createNewWindow();
    globalMenu.setApplicationMenu(globalMenu.buildFromTemplate(menuTemplate));
});

const createNewWindow = () => {
    const bounds = mainWindow ? mainWindow.getBounds() : undefined;
    const window = new BrowserWindow({
        width: 255,
        height: 255,
        frame: false,
        titleBarStyle: 'hidden'
    });

    if (bounds !== undefined) {
        window.setPosition(bounds.x, bounds.y + bounds.height);
    }

    window.loadURL('file://' + __dirname + '/dist/index.html');
    window.setAlwaysOnTop(true);

    window.on('focus', () => mainWindow = window);
    mainWindow = window;

    return window;
};

ipcMain.on('createNewWindow', (ev, msg) => createNewWindow());
