import Nullstack from 'nullstack';

let LazyComponent

class LazyComponentLoader extends Nullstack {

  async hydrate() {
    LazyComponent = (await import('./LazyComponent')).default
  }

  render({ self }) {
    if (!self.hydrated) return false
    return <LazyComponent />
  }

}

export default LazyComponentLoader;