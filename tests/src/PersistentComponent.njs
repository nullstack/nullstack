import Nullstack from 'nullstack';

class PersistentComponent extends Nullstack {

  count = 0
  launchCount = 0

  prepare() {
    this.count = -1;
  }

  async initiate() {
    this.count = -1;
  }

  launch() {
    this.launchCount++
  }

  async hydrate() {
    this.count++
  }

  terminate() {
    this.count++
  }

  self({ self }) {
    return self
  }

  render({ self, instances }) {
    const aCount = instances['PersistentComponent/0-0-33/persistent-component/a']?.count
    const aTerminated = instances['PersistentComponent/0-0-33/persistent-component/a']?.self?.()?.terminated
    return (
      <div
        data-count={this.count}
        data-key={self.key}
        data-a-count={aCount}
        data-launch-count={this.launchCount}
        data-persistent={self.persistent}
        data-prerendered={self.prerendered}
        data-a-terminated={aTerminated}
      >
        <a href="/persistent-component/a"> a </a>
        <a href="/persistent-component/b"> b </a>
      </div>
    )
  }

}

export default PersistentComponent;