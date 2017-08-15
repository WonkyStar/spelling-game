import Tile from './Tile'
import Letter from './Letter'
import VoidMonster from './VoidMonster'
import SpellingGameHud from './SpellingGameHud'
import WhackAMoleHud from './WhackAMoleHud'
import IckMonster from './IckMonster'
import StifleMonster from './StifleMonster'
import data from '../../assets/data/data.json'

var hudStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#D5286E'
});

var hintStyle = new PIXI.TextStyle({
  fontFamily: "NZK",
  fontSize: 30,
  fill: '#B9FF00'
});

export default class Game { 
  constructor() {

    
    this.availableHints = 3;
    this.usedHints = 0;
    this.level = 0;
    this.score = 0;
    this.renderer = PIXI.autoDetectRenderer(256, 256, {antialias: false, transparent: false, resolution: 1});

    //Add the canvas to the HTML document
    document.body.appendChild(this.renderer.view);
    this.renderer.backgroundColor = 0xfffff;

    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.display = "block";
    this.renderer.autoResize = true;
    this.renderer.resize(window.innerWidth, window.innerHeight);

    this.stage = new PIXI.Container();


    this.originalStageSize = {w: this.renderer.width, h: this.renderer.height}
    this.addBackground(this.stage, 'https://res.cloudinary.com/nzk/image/upload/f_auto,w_1250/v1474041383/uta2qdw7uxmuoc8upf0r.jpg');


    this.letters = []
    this.tiles = []
    this.correctLetters = 0

    var words = data["year1/2"].slice()
    var pickedWords = []
    for (var i = 0; i < 3; i++) {  
      var index = Math.floor(Math.random() * words.length)
      pickedWords.push(words[index])
      words.splice(index, 1)
    } 
    
    this.words = pickedWords.map((word) => {
      return [{element: word.word, hint: word.hint, usedHint: false},
        {element: word.sentence.split('|').join(' '), hint: word.hint, usedHint: false}] 
    }).reduce((a, b) => {
      return a.concat(b)
    })
    console.log(this.words)

    this.currentWordIndex = 0
    this.word = this.words[this.currentWordIndex]


    this.generateScene(this.word)

    //setTimeout((() => {
      this.renderHud()
    //}).bind(this), 1000)

    this.animate();

    window.addEventListener('resize', () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
      this.stage.height = this.originalStageSize.h
      this.stage.width = this.originalStageSize.w
      this.stage.position.x = (window.innerWidth - this.originalStageSize.w) / 2
      this.stage.position.y = (window.innerHeight - this.originalStageSize.h) / 2

    })
  }

  animate() {
      this.renderer.render(this.stage);
      //this.rerender();
      requestAnimationFrame( this.animate.bind(this) );
   }

  createRectangle(x, y, height, width, color) {
    var rectangle = new PIXI.Graphics();
    rectangle.beginFill(color);
    rectangle.lineStyle(10, color);
    rectangle.moveTo(x,y);
    rectangle.lineTo(x + width, y)
    rectangle.lineTo(x + width, y + height)
    rectangle.lineTo(x, y + height)
    rectangle.endFill();
    return rectangle;
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

  renderImage(x, y, width, height, image) {
    var blockTexture = PIXI.Texture.fromImage(image);
    var block = new PIXI.Sprite(blockTexture);
    block.height = height;
    block.width = width;
    block.position.x = x;
    block.position.y = y;
    return block;
  }

  renderHud() {
    this.spellingHud = new SpellingGameHud(this.renderer.width, this.renderer.height, this.displayHint.bind(this))
    this.stage.addChild(this.spellingHud.container)
  }

  addBackground(stage, image) {
    var landscapeTexture = PIXI.Texture.fromImage(image);
    const ratio = landscapeTexture.orig.width / landscapeTexture.orig.height
    var texture2 = new PIXI.Texture(landscapeTexture)
    this.background = new PIXI.Sprite(texture2);
    this.background.height = this.renderer.height;
    this.background.width = this.renderer.width;
    this.background.anchor.x = 0;
    this.background.anchor.y = 0;
    this.background.position.x = 0;
    this.background.position.y = 0;
    stage.addChild(this.background);
  }

  cleanScene() {
    this.letters.map((letter) => {
      this.stage.removeChild(letter.letter)
    })

    this.tiles.map((tile) => {
      this.stage.removeChild(tile.graphics)
    })
  }

  renderTileRow() { }

  generateScene(word) {
    this.cleanScene()
    this.letters = []
    this.tiles = []
    const TILE_LENGTH = 120

    var elements = word.element.split(' ').length > 1
      ? word.element.split(' ')
      : word.element.split('')


    this.tiles = elements.map((l, i) => {
      var length = elements.length * TILE_LENGTH
      var margin = this.renderer.width / 2 - Math.min(elements.length, 6) * (TILE_LENGTH + 20) / 2
      var originalY = this.renderer.height / 3
      var y = originalY
      if (i > 5) {
        y = originalY + 200;
      }
      var pos = {
        x: margin + (120 * (i % 6)),
        y: y
      }
      return new Tile(this, i, margin + ((TILE_LENGTH+20)*(i % 6)), pos.y, TILE_LENGTH, l)
    })

    this.letters = elements.map((element, i) => {
      return new Letter(this,
        element,
        Math.random()*(this.renderer.width - 100) + 50,
        Math.random()*(this.renderer.height / 3) + this.renderer.height / 2,
        i,
        this.tiles);
    })
  }

  nextWord() {
    this.spellingHud.clearHint()

    if (this.currentWordIndex < this.words.length - 1) {
      this.currentWordIndex++;

      this.spellingHud.setLevel(this.currentWordIndex)
      this.word = this.words[this.currentWordIndex]
      this.generateScene(this.word)

    } else {
      this.generateWhackAMoleScene()
    }

  }

  calculateScore() {
    var correct = 0
    var placed = 0
    this.letters.map((letter) => {
      if (letter.correct) {
        correct++
      }
      if (letter.placedIndex > -1) {
        placed++
      }
    })


    if (correct === this.letters.length) {
      var earnedPoint = this.word.usedHint ? 5 : 10;


      this.score+=earnedPoint
      this.spellingHud.setScore(this.score)
      this.nextWord()
    } else if (placed === this.letters.length) {
      this.nextWord()
    }
  }


  incrementScore(points) {
    this.whackAMoleScore+=points;
    this.whackAMoleHud.setScore(this.whackAMoleScore)
  }

  gameOver() {
    this.gameOver = true;
  }

  startTimer() {

      var interval = setInterval((() => {
        var time = (parseInt(this.whackAMoleHud.getTime()) - 1)
        if (time < 0) {

          /// GAME OVER SCREEN
          for (var i = this.stage.children.length - 1; i >= 0; i--) {	this.stage.removeChild(this.stage.children[i]);};

          this.generateEndScene()

          clearInterval(interval)
        } else {
          this.whackAMoleHud.setTime(time)
        }
      }).bind(this), 1000)

  }

  generateEndScene() {

    this.addBackground(this.stage, 'https://res.cloudinary.com/nzk/image/upload/f_auto,w_1250/v1474041383/uta2qdw7uxmuoc8upf0r.jpg');

    var bgEnd = this.renderImage(this.renderer.width / 2,
      this.renderer.height / 2, this.renderer.width, 360, '/assets/endscr.png')
      bgEnd.anchor.set(0.5)
      this.stage.addChild(bgEnd)


    var scoreLabel = new PIXI.Text('SCORE', hudStyle);
    scoreLabel.style.fontSize = 50;
    scoreLabel.style.fill = '#FFFFFF';

    scoreLabel.anchor.set(0.5);
    scoreLabel.x = this.renderer.width / 2;
    scoreLabel.y = this.renderer.height / 2 - 60;
    this.stage.addChild(scoreLabel);

    var whackScoreLabel = new PIXI.Text(this.whackAMoleScore, hudStyle);
    whackScoreLabel.anchor.set(0.5);
    whackScoreLabel.x = this.renderer.width / 2;
    whackScoreLabel.y = this.renderer.height / 2;
    this.stage.addChild(whackScoreLabel);

    var nbOrbs = Math.floor(this.whackAMoleScore / 3000)
    var nbOrbsLabel = new PIXI.Text('You got ' + nbOrbs + ' orbs !', hudStyle);
    nbOrbsLabel.anchor.set(0.5);
    nbOrbsLabel.x = this.renderer.width / 2;
    nbOrbsLabel.y = this.renderer.height / 2 + 60;
    this.stage.addChild(nbOrbsLabel);
  }

  generateWhackAMoleScene() {
    this.whackAMoleScore = 0;
    this.gameOver = false;
    this.cleanScene()

    this.stage.removeChild(this.spellingHud.container)
    this.whackAMoleHud = new WhackAMoleHud(this.renderer.width, this.renderer.height)
    this.stage.addChild(this.whackAMoleHud.container)
    this.whackAMoleHud.setTime(this.score)

    this.startTimer()
    this.whackAMoleHud.setLevel('Whack-A-Mole!')


    var ticker = 0;
    var interv = setInterval((() => {
      var time = parseInt(this.whackAMoleHud.getTime())
      if (time < 1) {
        clearInterval(interv)
      }
      ticker++
      if (ticker % 1 === 0) {
        var voidspider = new VoidMonster(this.stage, this.originalStageSize, Math.random() * this.renderer.width,1,1, Math.random()*1000, this.incrementScore.bind(this))
        this.stage.addChild(voidspider.container);
      }

      if (ticker % 4 === 0) {
        var ick = new IckMonster(this.stage, this.originalStageSize, Math.random() * this.renderer.width,1,3, Math.random()*1000, this.incrementScore.bind(this))
        this.stage.addChild(ick.container);
      }

      if (ticker % 10 === 0) {
        var stiffle = new StifleMonster(this.stage, this.originalStageSize, Math.random() * this.renderer.width,1,10, Math.random()*1000, this.incrementScore.bind(this))
        this.stage.addChild(stiffle.container);
      }

    }).bind(this), 1000)

  }

  renderScoreLabel() {
    this.whackScoreLabel = new PIXI.Text('0', hudStyle);
    this.whackScoreLabel.x = 10;
    this.whackScoreLabel.y = 70;
    this.stage.addChild(this.whackScoreLabel);
  }

  rerender() {
    this.hintButton.x = this.renderer.width / 2;
    this.hintButton.y = 27;
  }

  canUseHint() {
      return this.availableHints > 0 && !this.word.usedHint
  }

  displayHint() {

    if (this.canUseHint() ) {
      this.spellingHud.setHint(this.word.hint)
      this.availableHints--;
      this.word.usedHint = true;
    }

  }
}
