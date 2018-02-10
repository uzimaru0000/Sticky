require('./index.html');
require('./style.css');

const {ipcRenderer, remote} = require('electron');
const fs = require('fs');

const elm = require('./Elm/Main.elm');
const mount = document.getElementById('mount');
const app = elm.Main.embed(mount);

app.ports.focus_.subscribe(x => {
    const textarea = document.getElementById('inputArea');
    setTimeout(x => textarea.focus(), 1);
});

app.ports.createNewWindow_.subscribe(() => ipcRenderer.send('createNewWindow'));
app.ports.save.subscribe(args => {
    fs.writeFile(args.path, args.content, (err) => {
        if (err) remote.dialog.showErrorBox('Cannot save file: ' + fileName, err);
    });
});

ipcRenderer.on('save', () => {
    remote.dialog.showSaveDialog(null, {
        title: 'save',
        defaultPath: '.',
        filters: [
            {name: 'MarkDown', extensions: ['md']}
        ]
    }, (fileName) => {
        if (fileName === undefined) return;
        app.ports.saveHook.send(fileName);
    })
});

app.ports.close_.subscribe(() => ipcRenderer.send('close'));