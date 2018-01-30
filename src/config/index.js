require('./config.html');
// require('./style.css');

const elm = require('./Elm/Main.elm');
const mount = document.getElementById('mount');

const app = elm.Main.embed(mount);