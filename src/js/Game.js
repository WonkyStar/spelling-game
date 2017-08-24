import Tile from './Tile'
import Letter from './Letter'
import VoidMonster from './VoidMonster'
import SpellingGameHud from './SpellingGameHud'
import WhackAMoleHud from './WhackAMoleHud'
import IckMonster from './IckMonster'
import StifleMonster from './StifleMonster'
import data from '../../assets/data/data.json'
// import PIXI from 'pixi.js'

var hudStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 30,
  fill: '#D5286E'
})

const end_scoreStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 80,
  fill: '#51197E'
})
const end_scoreLabelStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 30,
  fill: '#7E0E7C'
})
const end_rewardLabelStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 30,
  fill: '#8C004B'
})
const end_rewardStyle = new PIXI.TextStyle({
  fontFamily: 'NZK',
  fontSize: 40,
  fill: '#DE0077'
})

export default class Game {
  constructor () {
    this.availableHints = 3
    this.usedHints = 0
    this.level = 0
    this.score = 0
    this.renderer = PIXI.autoDetectRenderer(256, 256, {
      antialias: false,
      transparent: false,
      resolution: 1
    })

    document.body.appendChild(this.renderer.view)
    this.renderer.backgroundColor = 0xfffff

    this.renderer.view.style.position = 'absolute'
    this.renderer.view.style.display = 'block'
    this.renderer.autoResize = true
    this.renderer.resize(window.innerHeight * 4 / 3, window.innerHeight)
    this.renderer.view.style.left = `calc(50% - ${window.innerHeight *
      4 /
      6}px)`
    this.renderer.view.style.top = `calc(50% - ${window.innerHeight / 2}px)`
    this.stage = new PIXI.Container()
    this.stage.updateLayersOrder = () => {
      this.stage.children.sort((a, b) => {
        a.zIndex = a.zIndex || 0
        b.zIndex = b.zIndex || 0
        return a.zIndex - b.zIndex
      })
    }
    this.originalStageSize = {
      w: this.renderer.width,
      h: this.renderer.height
    }
    this.addBackground(this.stage, '/assets/background.jpg')
    this.addForeground(this.stage, '/assets/enclosures-woods-01.png')

    this.letters = []
    this.tiles = []
    this.correctLetters = 0

    var words = data['year1/2'].slice()
    var pickedWords = []
    for (var i = 0; i < 3; i++) {
      var index = Math.floor(Math.random() * words.length)
      pickedWords.push(words[index])
      words.splice(index, 1)
    }

    this.words = pickedWords
      .map(word => {
        return [
          { element: word.word, hint: word.hint, usedHint: false },
          {
            element: word.sentence.split('|').join(' '),
            hint: word.hint,
            usedHint: false
          }
        ]
      })
      .reduce((a, b) => {
        return a.concat(b)
      })

    // this.words = [
      //   {
      //     element: '1',
      //     hint: 'ZA',
      //     usedHint: false
      //   }
      // ]

    this.currentWordIndex = 0
    this.word = this.words[this.currentWordIndex]

    this.generateScene(this.word)

    this.renderHud()

    this.animate()
  }

  animate () {
    this.renderer.render(this.stage)
    window.requestAnimationFrame(this.animate.bind(this))
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

  createBlock (x, y, height, width) {
    var blockTexture = PIXI.Texture.fromImage('/assets/block.png')
    var block = new PIXI.Sprite(blockTexture)
    block.height = height
    block.width = width
    block.position.x = x
    block.position.y = y
    return block
  }

  renderImage (x, y, width, height, image) {
    var blockTexture = PIXI.Texture.fromImage(image)
    var block = new PIXI.Sprite(blockTexture)
    block.height = height
    block.width = width
    block.position.x = x
    block.position.y = y
    return block
  }

  renderHud () {
    this.spellingHud = new SpellingGameHud(
      this.renderer.width,
      this.renderer.height,
      this.displayHint.bind(this)
    )
    this.spellingHud.container.zIndex = 6
    this.stage.addChild(this.spellingHud.container)
    this.stage.updateLayersOrder()
  }

  addBackground (stage, image) {
    var landscapeTexture = PIXI.Texture.fromImage(image)
    var texture2 = new PIXI.Texture(landscapeTexture)
    this.background = new PIXI.Sprite(texture2)
    this.background.height = this.renderer.height
    this.background.width = this.renderer.width
    this.background.zIndex = -5
    this.background.anchor.x = 0
    this.background.anchor.y = 0
    this.background.position.x = 0
    this.background.position.y = 0
    stage.addChild(this.background)
    stage.updateLayersOrder()
  }

  addForeground (stage, image) {
    var landscapeTexture = PIXI.Texture.fromImage(image)
    var texture2 = new PIXI.Texture(landscapeTexture)
    this.foreground = new PIXI.Sprite(texture2)
    this.foreground.height = this.renderer.height
    this.foreground.width = this.renderer.width
    this.foreground.zIndex = 5
    this.foreground.anchor.x = 0
    this.foreground.anchor.y = 0
    this.foreground.position.x = 0
    this.foreground.position.y = 0
    stage.addChild(this.foreground)
    stage.updateLayersOrder()
  }

  cleanScene () {
    this.letters.map(letter => {
      this.stage.removeChild(letter.letter)
    })

    this.tiles.map(tile => {
      this.stage.removeChild(tile.graphics)
    })
  }

  generateScene (word) {
    this.cleanScene()
    this.letters = []
    this.tiles = []
    const TILE_LENGTH = 120

    var elements =
    word.element.split(' ').length > 1
      ? word.element.split(' ')
      : word.element.split('')

    this.tiles = elements.map((l, i) => {
      var margin =
      this.renderer.width / 2 -
        Math.min(elements.length, 6) * (TILE_LENGTH + 20) / 2
      var originalY = this.renderer.height / 3
      var y = originalY
      if (i > 5) {
        y = originalY + 200
      }
      var pos = {
        x: margin + 120 * (i % 6),
        y: y
      }
      return new Tile(
        this,
        i,
        margin + (TILE_LENGTH + 20) * (i % 6),
        pos.y,
        TILE_LENGTH,
        l
      )
    })

    this.letters = elements.map((element, i) => {
      return new Letter(
        this,
        element,
        Math.random() * (this.renderer.width - 100) + 50,
        Math.random() * (this.renderer.height / 3) + this.renderer.height / 2,
        i,
        this.tiles
      )
    })
  }

  nextWord () {
    this.spellingHud.removeMessage()
    this.spellingHud.clearHint()

    if (this.currentWordIndex < this.words.length - 1) {
      this.currentWordIndex++

      this.spellingHud.setLevel(this.currentWordIndex)
      this.word = this.words[this.currentWordIndex]
      this.generateScene(this.word)
    } else {
      this.generateWhackAMoleScene()
    }
  }

  calculateScore () {
    var correct = 0
    var placed = 0
    this.letters.map(letter => {
      if (letter.correct) {
        correct++
      }
      if (letter.placedIndex > -1) {
        placed++
      }
    })

    if (correct === this.letters.length) {
      var earnedPoint = this.word.usedHint ? 5 : 10

      this.score += earnedPoint
      this.spellingHud.setScore(this.score)
      // CORRECT ANSWER ANIMATION

      this.tiles.map(tile => {
        tile.makeGreen()
        this.spellingHud.displayMessage('Correct', { fillColor: '#00FF00' })
      })
      setTimeout(() => {
        this.nextWord()
      }, 2000)
    } else if (placed === this.letters.length) {
      // WRONG ANSWER ANIMATION
      this.tiles.map(tile => {
        tile.makeRed()
        this.spellingHud.displayMessage('Wrong', { fillColor: '#FF0000' })
      })
      setTimeout(() => {
        this.nextWord()
      }, 2000)
    }
  }

  incrementScore (points) {
    this.whackAMoleScore += points
    this.whackAMoleHud.setScore(this.whackAMoleScore)
  }

  gameOver () {
    this.gameOver = true
  }

  startTimer () {
    var interval = setInterval(() => {
      var time = parseInt(this.whackAMoleHud.getTime()) - 1
      if (time < 0) {
        // / GAME OVER SCREEN
        for (var i = this.stage.children.length - 1; i >= 0; i--) {
          this.stage.removeChild(this.stage.children[i])
        }
        this.generateEndScene()

        clearInterval(interval)
      } else {
        this.whackAMoleHud.setTime(time)
      }
    }, 1000)
  }

  generateEndScene () {
    this.addBackground(this.stage, '/assets/background.jpg')
    this.addForeground(this.stage, '/assets/enclosures-woods-01.png')

    var bgEnd = this.renderImage(
      this.renderer.width / 2,
      this.renderer.height / 2,
      this.renderer.width / 2,
      this.renderer.width / 2,
      '/assets/ORB.png'
    )
    bgEnd.anchor.set(0.5)
    this.stage.addChild(bgEnd)

    var scoreLabel = new PIXI.Text('SCORE', end_scoreLabelStyle)
    scoreLabel.style.fontSize = 50

    scoreLabel.anchor.set(0.5)
    scoreLabel.x = this.renderer.width / 2
    scoreLabel.y = this.renderer.height / 2 - 100
    this.stage.addChild(scoreLabel)

    var whackScoreLabel = new PIXI.Text(this.whackAMoleScore, end_scoreStyle)
    whackScoreLabel.anchor.set(0.5)
    whackScoreLabel.x = this.renderer.width / 2
    whackScoreLabel.y = this.renderer.height / 2 - 30
    this.stage.addChild(whackScoreLabel)

    var rewardLabel = new PIXI.Text('REWARD', end_rewardLabelStyle)
    rewardLabel.style.fontSize = 50

    rewardLabel.anchor.set(0.5)
    rewardLabel.x = this.renderer.width / 2
    rewardLabel.y = this.renderer.height / 2 + 40
    this.stage.addChild(rewardLabel)

    var nbOrbs = Math.floor(this.whackAMoleScore / 3000)
    var nbOrbsLabel = new PIXI.Text(
      `${nbOrbs} orb${nbOrbs > 1 ? 's' : ''}`,
      end_rewardStyle
    )
    nbOrbsLabel.anchor.set(0.5)
    nbOrbsLabel.x = this.renderer.width / 2
    nbOrbsLabel.y = this.renderer.height / 2 + 100
    this.stage.addChild(nbOrbsLabel)
  }

  generateWhackAMoleScene () {
    this.whackAMoleScore = 0
    this.gameOver = false
    this.cleanScene()

    this.stage.removeChild(this.spellingHud.container)
    this.whackAMoleHud = new WhackAMoleHud(
      this.renderer.width,
      this.renderer.height
    )
    this.whackAMoleHud.container.zIndex = 6
    this.stage.addChild(this.whackAMoleHud.container)
    this.stage.updateLayersOrder()
    this.whackAMoleHud.setTime(this.score)

    this.startTimer()

    var ticker = 0
    var interv = setInterval(() => {
      var time = parseInt(this.whackAMoleHud.getTime())
      if (time < 1) {
        clearInterval(interv)
      }
      ticker++
      if (ticker % 1 === 0) {
        var voidspider = new VoidMonster(
          this.stage,
          this.originalStageSize,
          50 + Math.random() * this.renderer.width - 100,
          1,
          1,
          Math.random() * 1000,
          this.incrementScore.bind(this)
        )
        this.stage.addChild(voidspider.container)
        this.stage.updateLayersOrder()
      }

      if (ticker % 4 === 0) {
        var ick = new IckMonster(
          this.stage,
          this.originalStageSize,
          Math.random() * this.renderer.width,
          1,
          3,
          Math.random() * 1000,
          this.incrementScore.bind(this)
        )
        this.stage.addChild(ick.container)
        this.stage.updateLayersOrder()
      }

      if (ticker % 5 === 0) {
        var stiffle = new StifleMonster(
          this.stage,
          this.originalStageSize,
          Math.random() * this.renderer.width,
          1,
          10,
          Math.random() * 1000,
          this.incrementScore.bind(this)
        )
        this.stage.addChild(stiffle.container)
        this.stage.updateLayersOrder()
      }
    }, 1000)
  }

  renderScoreLabel () {
    this.whackScoreLabel = new PIXI.Text('0', hudStyle)
    this.whackScoreLabel.x = 10
    this.whackScoreLabel.y = 70
    this.stage.addChild(this.whackScoreLabel)
  }

  rerender () {
    this.hintButton.x = this.renderer.width / 2
    this.hintButton.y = 27
  }

  

  canUseHint () {
    return this.availableHints > 0 && !this.word.usedHint
  }

  displayHint () {
    if (this.canUseHint()) {
      this.spellingHud.setHint(this.word.hint)
      this.availableHints--
      this.word.usedHint = true
    }
  }
}
