import SpellingGameHud from '../SpellingGameHud'
import Tile from '../Tile'
import Letter from '../Letter'

export default class SpellingGameScene {

  constructor (words, over) {
    this.words = words
    this.over = over

    this.currentWordIndex = 0
    this.word = this.words[this.currentWordIndex]

    this.stage = new PIXI.Container()
  }

  generateScene (word) {
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
        y = originalY + 200
      }
      var pos = {
        x: margin + (120 * (i % 6)),
        y: y
      }
      return new Tile(this, i, margin + ((TILE_LENGTH + 20) * (i % 6)), pos.y, TILE_LENGTH, l)
    })

    this.letters = elements.map((element, i) => {
      return new Letter(this,
        element,
        Math.random() * (this.renderer.width - 100) + 50,
        Math.random() * (this.renderer.height / 3) + this.renderer.height / 2,
        i,
        this.tiles)
    })
  }

  nextWord () {
    this.spellingHud.clearHint()

    if (this.currentWordIndex < this.words.length - 1) {
      this.currentWordIndex++

      this.spellingHud.setLevel(this.currentWordIndex)
      this.word = this.words[this.currentWordIndex]
      this.generateScene(this.word)

    } else {
      this.over()
    }
  }

  calculateScore () {
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
      var earnedPoint = this.word.usedHint ? 5 : 10

      this.score += earnedPoint
      this.spellingHud.setScore(this.score)
      this.nextWord()
    } else if (placed === this.letters.length) {

      this.tiles.map((tile) => {
        tile.makeRed()
      })
      this.nextWord()
    }
  }

  renderHud () {
    this.spellingHud = new SpellingGameHud(this.renderer.width, this.renderer.height, this.displayHint.bind(this))
    this.stage.addChild(this.spellingHud.container)
  }

}
