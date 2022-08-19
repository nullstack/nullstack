import Nullstack from 'nullstack';

class AnchorModifiers extends Nullstack {

  html = `
    <a href="/anchor-modifiers?source=html">html</a>
  `

  count = 0
  objected = false
  updated = false

  hydrate() {
    this._element.querySelector('a').addEventListener('click', () => {
      this.clickedHTML = true
    })
  }

  clickJSX() {
    this.clickedJSX = true
  }

  markAsUpdated() {
    document.body.dataset.updated = true
  }

  increment() {
    this.count++
  }

  render() {
    return (
      <div ref={this._element} data-clicked-jsx={this.clickedJSX} data-clicked-html={this.clickedHTML} data-count={this.count} data-objected={this.objected} data-updated={this.updated} data-hydrated={this.hydrated}>
        <div html={this.html} />
        <button onclick={this.markAsUpdated}> update </button>
        <a href="/anchor-modifiers?source=jsx" onclick={this.clickJSX}>
          jsx
        </a>
        <a href="/anchor-modifiers?source=incremented" onclick={this.increment}>
          increment
        </a>
        <a href="/anchor-modifiers?source=object" onclick={{ objected: true }}>
          object
        </a>
        <a href="/anchor-modifiers?source=array" onclick={[this.increment, { objected: true }]}>
          array
        </a>
      </div>
    )
  }

}

export default AnchorModifiers;