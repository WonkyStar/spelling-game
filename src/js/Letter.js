
function getFontStyle(word) {

  var fontSize = 120
  if ((word.split('').length) > 1) {
    fontSize =  30
  }

  return new PIXI.TextStyle({
    fontFamily: 'Helvetica',
    fontSize: fontSize,
    fill: ['#A72990', '#2E3990'], // gradient
    stroke: '#eee',
    strokeThickness: fontSize / 10,
    wordWrap: true,
    wordWrapWidth: 440
  });
}

export default class Letter {
  constructor(game, letter, x, y, rightIndex, tiles) {

    this.L = letter;
    this.game = game;
    var text = new PIXI.Text(letter, getFontStyle(letter));
    var texture = text.generateTexture(this.game.renderer)
    this.letter = new PIXI.Sprite(texture)
    this.tiles = tiles
    this.correct = false
    this.rightIndex = rightIndex
    this.placedIndex = -1
    this.target = tiles[rightIndex]

    this.letter.interactive = true;

    this.letter.buttonMode = true;

    this.letter.anchor = {x: 0.5, y: 1}


    // setup events for mouse + touch using
    this.letter
      .on('pointerdown', this.onDragStart.bind(this))
      .on('pointerup', this.onDragEnd.bind(this))
      .on('pointerupoutside', this.onDragEnd.bind(this))
      .on('pointermove', this.onDragMove.bind(this));

    this.letter.x = x;
    this.letter.y = y;

    this.moveTo = this.moveTo.bind(this)
    // add it to the stage
    this.game.stage.addChild(this.letter);
  }

  moveTo(x,y) {
    this.letter.position.x = x;
    this.letter.position.y = y;
  }

  onDragStart(event) {
    this.letter.data = event.data;
    this.letter.alpha = 0.5;
    this.letter.anchor = {x: 0.5, y: 0.5}
    this.letter.dragging = true;
  }

  onDragEnd() {
    this.letter.alpha = 1;
    this.letter.dragging = false;
    // set the interaction data to null
    this.letter.data = null;

    this.letter.anchor = {x: 0.5, y: 1}
    if (this.L === ',') {
      this.letter.anchor = {x: 0.5, y: 0.7}
    }

    this.tiles.map((tile) => {
      if (this.isHoverTile(tile)) {
        this.placedIndex = tile.index
        this.correct = tile.acceptedLetter === this.L
        tile.resetColor()
        this.letter.position.x = tile.x + tile.length / 2;
        this.letter.position.y = tile.y;
      }
    })
    this.game.calculateScore()
  }

  onDragMove() {
    if (this.letter.dragging) {
      var newPosition = this.letter.data.getLocalPosition(this.letter.parent);
      this.letter.position.x = newPosition.x;
      this.letter.position.y = newPosition.y;

      this.tiles.map((tile) => {
        if (this.isHoverTile(tile)) {
          tile.highlight()
        } else {
          tile.resetColor()
        }
      })
    }
  }

  isHoverTile(tile) {
    return (
      this.letter.position.x > tile.x
      && this.letter.position.x < tile.x + tile.length
      && this.letter.position.y < tile.y
      && this.letter.position.y > tile.y - 150
    )
  }


}
