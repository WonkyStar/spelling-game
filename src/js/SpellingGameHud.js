const hudStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 25,
  fill: '#000'
})

var displayedMessageStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 40
})

const hintHudStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 25,
  fill: '#FFF'
})

var hintStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 15,
  fill: '#B9FF00'
})

export default class SpellingGameHud {
  constructor (width, height, displayHint) {
    this.displayHint = displayHint
    this.width = width
    this.height = height
    this.container = new PIXI.Container()
    this.container.position.x = 0
    this.container.position.y = 0
    this.renderTimeScore()
    this.renderLevelLabel()
    this.renderHintButton()

    this.message = new PIXI.Text('', displayedMessageStyle)
    this.message.anchor.set(0.5)
    this.message.x = this.container.width / 2
    this.message.y = this.container.height / 2 + 40
    this.container.addChild(this.message)
  }

  createBlock (x, y, height, width) {
    var blockTexture = PIXI.Texture.fromImage('/assets/block.png')
    var block = new PIXI.Sprite(blockTexture)
    block.height = height
    block.width = width
    block.position.x = x
    block.position.y = y
    return block
  }

  renderLevelLabel () {
    var texture = PIXI.Texture.fromImage('./assets/level.png')
    var sprite = new PIXI.Sprite(texture)

    sprite.height = 50
    sprite.width = 150
    sprite.position.x =
      sprite.position.y = 10
    this.container.addChild(sprite)

    var levelText = new PIXI.Text('Level', hudStyle)
    levelText.setText('Level')
    levelText.x = 20
    levelText.y = 20
    this.container.addChild(levelText)

    this.levelLabel = new PIXI.Text('Level', hudStyle)
    this.levelLabel.setText('0')
    this.levelLabel.x = 125
    this.levelLabel.y = 20
    this.container.addChild(this.levelLabel)
  }

  createRectangle (x, y, height, width, color) {
    var rectangle = new PIXI.Graphics()
    rectangle.beginFill(color)
    rectangle.lineStyle(10, color)
    rectangle.moveTo(x, y)
    rectangle.lineTo(x + width, y)
    rectangle.lineTo(x + width, y + height)
    rectangle.lineTo(x, y + height)
    rectangle.endFill()
    return rectangle
  }

  renderTimeScore () {
    var texture = PIXI.Texture.fromImage('./assets/time.png')
    var sprite = new PIXI.Sprite(texture)

    sprite.height = 50
    sprite.width = 100
    sprite.position.x = this.width - 120
    sprite.position.y = 10
    this.container.addChild(sprite)

    this.scoreLabel = new PIXI.Text('0', hudStyle)
    this.scoreLabel.x = this.width - 70
    this.scoreLabel.y = 20
    this.container.addChild(this.scoreLabel)
  }

  setLevel (n) {
    this.levelLabel.setText('' + n)
  }

  setScore (n) {
    this.scoreLabel.setText(n + '')
  }

  renderHintButton () {
    var texture = PIXI.Texture.fromImage('./assets/hint.png')
    var sprite = new PIXI.Sprite(texture)

    sprite.scale.x = 0.06
    sprite.scale.y = 0.06
    sprite.position.x = this.width - 170
    sprite.position.y = this.height - 60
    this.container.addChild(sprite)

    this.hintLabel = new PIXI.Text('Hint', hintHudStyle)
    this.hintLabel.x = this.width - 150
    this.hintLabel.y = this.height - 50
    this.container.addChild(this.hintLabel)

    this.hintButton = sprite
    this.hintButton.interactive = true
    this.hintButton.buttonMode = true

    this.hintButton
      .on('pointerdown', () => {
        this.displayHint()
      })
  }

  setHint (hint) {
    this.hintLabel.style = hintStyle
    this.hintLabel.y = this.height - 42
    this.hintLabel.setText(hint)
  }

  clearHint () {
    this.hintLabel.style = hintHudStyle
    this.hintLabel.y = this.height - 50
    this.hintLabel.setText('Hint')
  }

  displayMessage (message, options) {
    this.message.setText(message)
    this.message.style.fill = options.fillColor
  }

  removeMessage () {
    if (!this.message) return
    this.message.setText('')
  }
}
