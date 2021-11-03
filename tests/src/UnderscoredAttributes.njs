import Nullstack from 'nullstack';

function underscoredAfterConstructor(value) {
  this.c = value
}

const underscoredObject = {
  withoutUnderscore(value) {
    this.d = value
  }
}

function _underscored(value) {
    this.e = value
  }

class UnderscoredAttributes extends Nullstack {

  a = 0
  b = 0
  c = 0
  d = 0
  e = 0

  _underscoredMethod(value) {
    this.a = value
  }

  _underscoredAttributeFunction = function (value) {
    this.b = value
  }

  notUnderscored = _underscored

  hydrate() {
    this._underscoredMethod(1)
    this._underscoredAttributeFunction(1)
    this._underscoredAfterConstructor = underscoredAfterConstructor
    this._underscoredAfterConstructor(1)
    this._underscoredObject = underscoredObject
    this._underscoredObject.withoutUnderscore(1)
    this.notUnderscored(1)
  }

  render() {
    return (
      <div data-a={this.a} data-b={this.b} data-c={this.c} data-d={this.d} data-e={this.e}>
        <span>UnderscoredAttributes</span>
      </div>
    )
  }

}

export default UnderscoredAttributes;