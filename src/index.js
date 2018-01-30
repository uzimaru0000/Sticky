require('./index.html');
require('./style.css');

const {ipcRenderer} = require('electron');

const elm = require('./Elm/Main.elm');
const mount = document.getElementById('mount');
const app = elm.Main.embed(mount);

app.ports.focus_.subscribe(x => {
    const textarea = document.getElementById('inputArea');
    setTimeout(x => textarea.focus(), 1);
});

app.ports.createNewWindow_.subscribe(() => ipcRenderer.send('createNewWindow'));