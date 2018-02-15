const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow = null;
let windowCount = 0;

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
                click: () => createNewWindow()
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => mainWindow.webContents.send('save')
            }
        ]
    }
];

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
});

app.on('ready', () => {
    createNewWindow();
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
});

app.on('activate', () => {
    if (windowCount === 1) mainWindow.show();
});

app.on('before-quit', () => {
    windowCount = 0;
});

const createNewWindow = () => {
    const bounds = mainWindow ? mainWindow.getBounds() : undefined;
    const window = new BrowserWindow({
        width: 255,
        height: 255,
        frame: false
    });

    windowCount++;

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

    window.on('close', e => {
        if (windowCount === 1) {
            e.preventDefault();
            mainWindow.hide();
        } else {
            windowCount--;
        }
    });

    return window;
};

ipcMain.on('createNewWindow', (ev, msg) => createNewWindow());
ipcMain.on('close', () => {
    if (windowCount === 1) {
        mainWindow.hide();
    } else {
        mainWindow.close();
    }
});

ipcMain.on('changeWindowSize', (_, size) => {
    mainWindow.setResizable(!mainWindow.isResizable());
    mainWindow.setSize(size.width, size.height);
});