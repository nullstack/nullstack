import Nullstack from 'nullstack';
import LazyComponentSafelist from './LazyComponent'

let LazyComponent

class LazyComponentLoader extends Nullstack {

  static async start() {
    LazyComponentSafelist.safelist()
  }

  async hydrate() {
    LazyComponent = (await import('./LazyComponent')).default
  }

  render() {
    if (!this.hydrated) return false
    return <LazyComponent />
  }

}

export default LazyComponentLoader;