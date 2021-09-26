import Nullstack from 'nullstack';

class PersistentComponent extends Nullstack {

  count = 0

  prepare() {
    this.count = -1;
  }

  initiate() {
    this.count = -1;
  }

  async hydrate() {
    this.count++
  }

  terminate() {
    this.count++
  }

  render({ self, instances }) {
    const aCount = instances['n-0-0-33/persistent-component/a']?.count
    return (
      <div data-count={this.count} data-key={self.key} data-a-count={aCount}>
        <a href="/persistent-component/a"> a </a>
        <a href="/persistent-component/b"> b </a>
      </div>
    )
  }

}

export default PersistentComponent;