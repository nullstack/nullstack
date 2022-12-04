import Nullstack from 'nullstack'

function underscoredAfterConstructor(value) {
  this.c = value
}

const underscoredObject = {
  withoutUnderscore(value) {
    this.d = value
  },
}

function _underscored({ string, value }) {
  this.e = string === 'nullstack' && value
}

class UnderscoredAttributes extends Nullstack {

  a = 0
  b = 0
  c = 0
  d = 0
  e = 0
  f = 0

  prepare() {
    this._g = 1
  }

  _underscoredMethod(value) {
    this.a = value
  }

  _underscoredAttributeFunction = function (value) {
    this.b = value
  }

  notUnderscored = _underscored

  _underscoredEvent() {
    this.f = 1
  }

  hydrate() {
    this._underscoredMethod(1)
    this._underscoredAttributeFunction(1)
    this._underscoredAfterConstructor = underscoredAfterConstructor
    this._underscoredAfterConstructor(1)
    this._underscoredObject = underscoredObject
    this._underscoredObject.withoutUnderscore(1)
    this.notUnderscored({ value: 1 })
  }

  setEventListener({ element }) {
    element.addEventListener('click', this._underscoredEvent)
  }

  render() {
    return (
      <div
        data-a={this.a}
        data-b={this.b}
        data-c={this.c}
        data-d={this.d}
        data-e={this.e}
        data-f={this.f}
        data-g={this._g}
      >
        <button ref={this.setEventListener} data-hydrated={this.hydrated}>
          UnderscoredAttributes
        </button>
      </div>
    )
  }

}

export default UnderscoredAttributes
