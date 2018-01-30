const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron;

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
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => {
                    mainWindow.webContents.send('save');
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
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
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
        const screenSize = electron.screen.getPrimaryDisplay().size;
        if (bounds.y + bounds.height + 255 >= screenSize.height) {
            if (bounds.x + bounds.width + 255 >= screenSize.width) {
                window.setPosition(0, 0);
            } else {
                window.setPosition(bounds.x + bounds.width, 0);
            }
        } else {
            window.setPosition(bounds.x, bounds.y + bounds.height);
        }
    }

    window.loadURL('file://' + __dirname + '/dist/index.html');
    window.setAlwaysOnTop(true);

    window.on('focus', () => mainWindow = window);
    mainWindow = window;

    return window;
};

ipcMain.on('createNewWindow', (ev, msg) => createNewWindow());
