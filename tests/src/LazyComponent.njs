import Nullstack from 'nullstack'
import './LazyComponent.css'

class LazyComponent extends Nullstack {

  static async serverFunctionWorks() {
    return true
  }

  async initiate() {
    this.safelisted = await this.serverFunctionWorks()
  }

  render() {
    return (
      <div data-lazy data-safelisted={this.safelisted}>
        {' '}
        LazyComponent{' '}
      </div>
    )
  }

}

export default LazyComponent
