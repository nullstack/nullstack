import Nullstack from 'nullstack';

class AnchorModifiers extends Nullstack {

  html = `
    <a href="/anchor-modifiers?source=html">html</a>
  `

  hydrate(context) {
    context.self.element.querySelector('a').addEventListener('click', () => {
      context.clickedHTML = true
    })
  }

  clickJSX(context) {
    context.clickedJSX = true
  }

  render({ clickedJSX, clickedHTML }) {
    return (
      <div data-clicked-jsx={clickedJSX} data-clicked-html={clickedHTML}>
        <div html={this.html} />
        <a href="/anchor-modifiers?source=jsx" onclick={this.clickJSX}>
          jsx
        </a>
      </div>
    )
  }

}

export default AnchorModifiers;