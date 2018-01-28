require('./index.html');

const elm = require('./Elm/Main.elm');
const mount = document.getElementById('mount');
const app = elm.Main.embed(mount);

app.ports.focus_.subscribe(x => {
    const textarea = document.getElementById('inputArea');
    setTimeout(x => textarea.focus(), 1);
});