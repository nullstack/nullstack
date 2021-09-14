import Nullstack from 'nullstack';

class PersistentComponent extends Nullstack {

  count = 0

  async hydrate() {
    this.count++
  }

  render() {
    return (
      <div data-count={this.count}>
        <a href="/persistent-component/a"> a </a>
        <a href="/persistent-component/b"> b </a>
      </div>
    )
  }

}

export default PersistentComponent;