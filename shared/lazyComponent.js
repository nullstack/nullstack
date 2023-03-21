import element from './element'

class LazyComponent {

  constructor(scope) {
    this.server = scope.context.server
  }

  async initiate() {
    this.component = (await this.importer()).default
  }

  render() {
    if (!this.component) return false
    const { key, ...attributes } = this._attributes
    return element(this.component, attributes)
  }

  toJSON() {
    return null
  }

}

export default LazyComponent