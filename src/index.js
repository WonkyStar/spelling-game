import '../assets/fonts/NZK/font.css'
import FontFaceObserver from 'fontfaceobserver'

import './styles/main.sass'
import Game from './js/Game'


var texture = PIXI.Texture.fromImage('https://res.cloudinary.com/nzk/image/upload/f_auto,w_1250/v1474041383/uta2qdw7uxmuoc8upf0r.jpg');
var sprite = new PIXI.Sprite(texture);

// Set FontObservers
var NZKFontObserver = new FontFaceObserver('NZK');
var LibreFontObserver = new FontFaceObserver('Libre Baskerville');
Promise.all([NZKFontObserver.load(), LibreFontObserver.load()]).then(function () {
    new Game()
}, function () {
  console.log('Font is not available');
});
