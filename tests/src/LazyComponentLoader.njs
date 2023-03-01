import Nullstack from 'nullstack'

import LazyComponentSafelist from './LazyComponent'

let LazyComponent

class LazyComponentLoader extends Nullstack {

  static async start() {
    LazyComponentSafelist.safelist()
  }

  async hydrate() {
    this.LazyComponent = (await import('./LazyComponent')).default
    console.log(LazyComponent)
    this.should = true
  }

  render() {
    console.log("RENDER", this.LazyComponent)
    if (!this.LazyComponent) return false
    return <this.LazyComponent />
  }

}

export default LazyComponentLoader
