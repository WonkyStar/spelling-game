export default class IckMonster {
  constructor (stage, originalStageSize, x, y, life = 3 , delay, onDeath) {
    this.life = life
    this.reward = 500
    this.voidSprite = new PIXI.Graphics()
    this.x = x
    this.stage = stage
    this.width = originalStageSize.w
    this.ticker = 0
    var ickTexture = PIXI.Texture.fromImage('/assets/ick_enclosure-01.png')
    var ickTexture2 = new PIXI.Texture(ickTexture)
    this.ickSprite = new PIXI.Sprite(ickTexture2)
    this.ickSprite.scale.x = 0.4
    this.ickSprite.scale.y = 0.4

    this.ickSprite.anchor = {x: 0, y: 1}
    this.ickSprite.position.x = -350

    this.ickSprite.position.y = originalStageSize.h - 100
    this.ickSprite.zIndex = -1

    this.onDeath = onDeath

    this.container = new PIXI.Container()
    this.container.addChild(this.ickSprite)

    this.container.interactive = true
    this.container.buttonMode = true
    this.container.on('pointerdown', (() => {
      this.onTap()}).bind(this))

    setTimeout(() => {
      this.animate()
    }, delay)
  }

  onTap () {
    if (this.life > 1) {
      this.life--
      this.ickSprite.anchor.y = 1
      this.ickSprite.scale.y -= 0.1
    } else { this.onDeath(this.reward); this.remove() }
  }
  remove () {
    this.stage.removeChild(this.container)
  }

  animate () {
    // ANIMATE ICK HERE

    if (this.ickSprite.position.x > -100 || this.goBack) {
      this.goBack = true
      if (this.ticker > Math.random() * 30 + 30) {
        this.ickSprite.position.x -= Math.random() * 3 + 5
      } else {
        this.ticker++
      }
    } else {
      this.ickSprite.position.x += Math.random() * 3 + 5
    }
    requestAnimationFrame(this.animate.bind(this))
  }

}
