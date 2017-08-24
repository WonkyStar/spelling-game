export default class VoidMonster {
  constructor (stage, originalStageSize, x, y, life = 1 , delay, onDeath) {
    this.life = life
    this.voidSprite = new PIXI.Graphics()
    this.reward = 100
    this.x = x
    this.onDeath = onDeath

    var voidTexture = PIXI.Texture.fromImage('/assets/void.png')
    var voidTexture2 = new PIXI.Texture(voidTexture)
    this.voidSprite = new PIXI.Sprite(voidTexture2)
    this.voidSprite.scale.x = 0.3
    this.voidSprite.scale.y = 0.3
    this.voidSprite.position.x = x
    this.voidSprite.position.y = -150

    this.goUp = false
    this.tail = new PIXI.Graphics()

    this.container = new PIXI.Container()
    this.stage = stage
    this.container.addChild(this.tail)

    this.tail.addChild(this.voidSprite)

    this.maxDrop = Math.random() * (originalStageSize.h / 2) + originalStageSize.h / 4
    this.speed = Math.random() * 15 + 5

    this.container.interactive = true
    this.container.buttonMode = true
    this.container.on('pointerdown', (() => {this.onTap()}).bind(this))

    setTimeout(() => {
      this.animate()
    }, delay)
  }

  onTap () {
    if (this.life > 1) { this.life-- } else { this.onDeath(this.reward); this.remove() }
  }

  remove () {
    this.stage.removeChild(this.container)
  }

  animate () {
    this.tail.clear()

    this.tail
      .beginFill(0xffffff, 1)
      .moveTo(this.x + 70, 0)
      .lineTo(this.x + 73, 0)
      .lineTo(this.x + 73, this.voidSprite.position.y + 90)
      .lineTo(this.x + 70, this.voidSprite.position.y + 90)

    if (this.voidSprite.position.y > this.maxDrop || this.goUp) {
      this.goUp = true
      this.voidSprite.position.y -= this.speed

      if (this.voidSprite.position.y < -100) {
        this.remove()
        this.goUp = false
      }
    } else {
      this.voidSprite.position.y += this.speed
    }

    requestAnimationFrame(this.animate.bind(this))
  }

}
