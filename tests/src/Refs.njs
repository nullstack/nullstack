import Nullstack from 'nullstack';

class Refs extends Nullstack {

  composedComputed = '_composedComputed'

  hydrate() {
    this.id = this._element.id
  }

  setRef({ element }) {
    this._function = element
    this.isOnDOM = element.offsetHeight > 0
  }

  renderBubble({ ref }) {
    return (
      <div id="bubble" ref={ref} data-id={this._bubble?.id} />
    )
  }

  render() {
    return (
      <div id="hydrate-element" data-id={this.id} ref={this._element}>
        <span id="composed-computed" ref={this[this.composedComputed]} data-id={this._composedComputed?.id} />
        <span id="logical-computed" ref={this[['_logical', 'Computed'].join('')]} data-id={this._logicalComputed?.id} />
        <span id="literal-computed" ref={this['_literalComputed']} data-id={this._literalComputed?.id} />
        <span id="function" ref={this.setRef} data-dom={this.isOnDOM} data-id={this._function?.id}>span</span>
        <Bubble ref={this._bubble} />
      </div>
    )
  }

}

export default Refs;