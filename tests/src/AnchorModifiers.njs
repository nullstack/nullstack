import Nullstack from 'nullstack';

class AnchorModifiers extends Nullstack {

  html = `
    <a href="/anchor-modifiers?source=html">html</a>
  `

  render() {
    return (
      <div>
        <div html={this.html} />
        <a href="/anchor-modifiers?source=jsx">jsx</a>
      </div>
    )
  }

}

export default AnchorModifiers;