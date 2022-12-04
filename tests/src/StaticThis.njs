import Nullstack from 'nullstack'

class StaticThis extends Nullstack {

  name = ''

  static async getThisName() {
    return this.name
  }

  async initiate() {
    this.name = await this.getThisName()
  }

  render() {
    return <div data-name={this.name === this.constructor.name} />
  }

}

export default StaticThis
