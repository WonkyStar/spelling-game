const hudStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 25,
  fill: '#000'
})

export default class WhackAMoleHud {
  constructor (width, height, displayHint) {
    this.displayHint = displayHint
    this.width = width
    this.height = height
    this.container = new PIXI.Container()
    this.container.position.x = 0
    this.container.position.y = 0

    // Score Label

    this.renderScore()
    this.renderTime()
  }

  renderScore () {
    this.scoreLabel = new PIXI.Text('0', hudStyle)
    this.scoreLabel.x = 130
    this.scoreLabel.y = 60
    this.container.addChild(this.scoreLabel)
  }

  renderTime () {
    var texture = PIXI.Texture.fromImage('./assets/time.png')
    var sprite = new PIXI.Sprite(texture)

    sprite.height = 50
    sprite.width = 100
    sprite.position.x = this.width - 120
    sprite.position.y = 10
    this.container.addChild(sprite)

    this.timeLabel = new PIXI.Text('0', hudStyle)
    this.timeLabel.x = this.width - 70
    this.timeLabel.y = 20
    this.container.addChild(this.timeLabel)
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

  setLevel (name) {
    this.levelLabel.setText(name)
  }

  setTime (n) {
    this.timeLabel.setText(n + '')
  }

  setScore (n) {
    this.scoreLabel.setText(n)
  }

  getTime () {
    return this.timeLabel.text
  }
}
