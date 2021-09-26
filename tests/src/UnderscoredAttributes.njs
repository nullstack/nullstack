import Nullstack from 'nullstack';

function underscoredAfterConstructor(value) {
  this.c = value
}

const underscoredObject = {
  withoutUnderscore(value) {
    this.d = value
  }
}

class UnderscoredAttributes extends Nullstack {

  a = 0
  b = 0
  c = 0
  d = 0

  _underscoredMethod(value) {
    this.a = value
  }

  _underscoredAttributeFunction = function (value) {
    this.b = value
  }

  hydrate() {
    this._underscoredMethod(1)
    this._underscoredAttributeFunction(1)
    this._underscoredAfterConstructor = underscoredAfterConstructor
    this._underscoredAfterConstructor(1)
    this._underscoredObject = underscoredObject
    this._underscoredObject.withoutUnderscore(1)
  }

  render() {
    return (
      <div data-a={this.a} data-b={this.b} data-c={this.c} data-d={this.d}>
        <span>UnderscoredAttributes</span>
      </div>
    )
  }

}

export default UnderscoredAttributes;