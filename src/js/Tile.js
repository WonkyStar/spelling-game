export default class Tile {
  constructor(game, index, x, y, length, acceptedLetter) {

    this.acceptedLetter = acceptedLetter;
    this.x = x;
    this.y = y;
    this.index = index;
    this.length = length;
    this.graphics = new PIXI.Graphics();

    this.graphics.beginFill(0xFF3300);
    this.graphics.lineStyle(10, 0xffd900, 1);
    this.game = game;
    this.graphics.moveTo(x,y);
    this.graphics.lineTo(x+length, y);
    this.graphics.endFill();

    this.game.stage.addChild(this.graphics);
  }

  highlight() {
    this.graphics.tint = 0xffff;
  }

  resetColor() {
    this.graphics.tint = 0xffffff;
  }
}
