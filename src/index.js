import '../assets/fonts/NZK/font.css'

import './styles/main.sass'
import Game from './js/Game'


var texture = PIXI.Texture.fromImage('https://res.cloudinary.com/nzk/image/upload/f_auto,w_1250/v1474041383/uta2qdw7uxmuoc8upf0r.jpg');
var sprite = new PIXI.Sprite(texture);

setTimeout(() => {
  new Game()
}, 100)
