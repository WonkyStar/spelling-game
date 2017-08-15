export default class StifleMonster {
  constructor(stage, originalStageSize, x, y, life = 10, delay, onDeath) {
    this.life = life;
    this.reward = 1000;
    this.voidSprite=new PIXI.Graphics();
    this.x = x
    this.stage = stage;
    this.width = this.stage.width;
    this.height = this.stage.height;
    this.ticker = 0;

    var stifleTexture = PIXI.Texture.fromImage('/assets/stifle.png');
    var stifleTexture2 = new PIXI.Texture(stifleTexture);
    this.stifleSprite = new PIXI.Sprite(stifleTexture2);
    this.stifleSprite.scale.x = 0.8;
    this.stifleSprite.scale.y = 0.8;

    this.fromLeft = Math.random() > 0.5;

    this.stifleSprite.anchor = {x: 0.5, y: 1}
    this.stifleSprite.position.x = window.innerWidth / 2;
    this.stifleSprite.position.y = window.innerHeight + 400;

    this.onDeath = onDeath;

    this.container=new PIXI.Container();
    this.container.addChild(this.stifleSprite);

    this.container.interactive=true;
    this.container.buttonMode=true;
    this.container.on('pointerdown',(() => {this.onTap() }).bind(this));
    stage.addChild(this.container);

    setTimeout(() => {
      this.animate()
    }, delay)
  }

  onTap() {
    if (this.life > 1) {
      this.life--;
      this.stifleSprite.anchor.y = 1;
      this.stifleSprite.scale.y-=0.04;
    }
    else { this.onDeath(this.reward); this.remove(); }
  }
  remove() {
    this.stage.removeChild(this.container)
  }


  animate() {

    if (this.stifleSprite.position.y < window.innerHeight + 10 || this.goDown) {
      this.goDown = true;

      if (this.ticker > Math.random() * 30 + 50) {
        this.stifleSprite.position.y+=5
      } else {
        this.ticker++
      }
      if (this.stifleSprite.position.y > window.innerHeight + 390) {
        this.remove()
        this.goDown = false
      }
    } else {
      this.stifleSprite.position.y-=5
    }

    requestAnimationFrame(this.animate.bind(this))
  }

}
