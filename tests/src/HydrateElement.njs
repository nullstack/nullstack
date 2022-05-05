import Nullstack from 'nullstack';

class HydrateElement extends Nullstack {

  hydrate({ self }) {
    this.id = self.element.id
  }

  render() {
    return (
      <div id="hydrate-element" data-id={this.id}> HydrateElement </div>
    )
  }

}

export default HydrateElement;