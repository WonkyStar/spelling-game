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

export default class SpellingGameHud {
  constructor(width, height, displayHint) {
    this.displayHint = displayHint
    this.width = width
    this.height = height
    this.container = new PIXI.Container();
    this.container.position.x = 0;
    this.container.position.y = 0;
    this.container.addChild(this.createBlock(-40,0,60,230))
    this.container.addChild(this.createBlock(width / 4, 0, 60, width / 2))
    this.container.addChild(this.createBlock(width - 150,0,60,150))


    this.levelLabel = new PIXI.Text('Level', hudStyle);
    this.levelLabel.setText('Level 0');
    this.levelLabel.x = 10
    this.levelLabel.y = 10
    this.container.addChild(this.levelLabel)

    // Score Label
    this.scoreLabel = new PIXI.Text('0s', hudStyle);
    this.scoreLabel.x = width - 100
    this.scoreLabel.y = 10
    this.container.addChild(this.scoreLabel)

    this.renderHintButton()

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

  setLevel(n) {
    this.levelLabel.setText('Level ' + n)
  }

  setScore(n) {
    this.scoreLabel.setText(n + 's')
  }

  renderHintButton() {
    this.hintButton = new PIXI.Text('Reveal Hint', hudStyle);
    this.hintButton.interactive = true;
    this.hintButton.buttonMode = true;
    this.hintButton.anchor.set(0.5);
    this.hintButton.x = this.width / 2;
    this.hintButton.y = 30;
    this.container.addChild(this.hintButton);

    this.hintButton
      .on('pointerdown', () => {
        this.displayHint()
      })

      this.container.addChild(this.createBlock(-10, this.height - 55,60, this.width + 10))
      this.hintLabel = new PIXI.Text('', hintStyle);
      this.hintLabel.anchor.set(0.5);
      this.hintLabel.x = this.width / 2;
      this.hintLabel.y = this.height - 30;
      this.container.addChild(this.hintLabel);
  }

  setHint(hint) {
    this.hintLabel.setText(hint)
  }

  clearHint() {
      this.hintLabel.setText('')
  }

}
