import Nullstack from 'nullstack'
import './LazyComponent.css'

class LazyComponent extends Nullstack {

  static async serverFunctionWorks() {
    return true
  }

  async initiate() {
    this.safelisted = await this.serverFunctionWorks()
  }

  render({ prop }) {
    return (
      <div data-lazy data-safelisted={this.safelisted} data-prop={prop}>
        <p>safelisted: {this.safelisted}</p>
        <p>prop: {prop}</p>
        <a href="/"> home </a>
      </div>
    )
  }

}

export default LazyComponent
