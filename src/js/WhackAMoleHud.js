const hudStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#D5286E'
});

var hintStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#B9FF00'
});

export default class WhackAMoleHud {
  constructor(width, height, displayHint) {
    this.displayHint = displayHint
    this.width = width
    this.height = height
    this.container = new PIXI.Container();
    this.container.position.x = 0;
    this.container.position.y = 0;
    this.container.addChild(this.createBlock(-40,0,60,380))
    this.container.addChild(this.createBlock(120,58,60,100))
    this.container.addChild(this.createBlock(width - 150,0,60,150))


    this.levelLabel = new PIXI.Text('Level', hudStyle);
    this.levelLabel.setText('');
    this.levelLabel.x = 10
    this.levelLabel.y = 10
    this.container.addChild(this.levelLabel)

    // Score Label
    this.timeLabel = new PIXI.Text('0s', hudStyle);
    this.timeLabel.x = width - 100
    this.timeLabel.y = 10
    this.container.addChild(this.timeLabel)

    this.scoreLabel = new PIXI.Text('0', hudStyle);
    this.scoreLabel.x = 130
    this.scoreLabel.y = 60
    this.container.addChild(this.scoreLabel)


    // Hint Button
  }

  createBlock(x, y, height, width) {
    var blockTexture = PIXI.Texture.fromImage('/assets/block.png');
    var block = new PIXI.Sprite(blockTexture);
    block.height = height;
    block.width = width;
    block.position.x = x;
    block.position.y = y;
    return block;
  }

  setLevel(name) {
    this.levelLabel.setText(name)
  }

  setTime(n) {
    this.timeLabel.setText(n + 's')
  }

  setScore(n) {
    this.scoreLabel.setText(n)
  }

  getTime() {
    return this.timeLabel.text
  }

}
