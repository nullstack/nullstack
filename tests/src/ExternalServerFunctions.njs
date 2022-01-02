import Nullstack from 'nullstack';
import PublicServerFunctions from './PublicServerFunctions';

class ExternalServerFunctions extends Nullstack {

  async initiate({ instances }) {
    this.serverMethod = await instances.publicServerFunctions.serverFunction({ number: 34 })
    this.serverStatic = await PublicServerFunctions.serverFunction({ number: 34 })
  }

  async hydrate({ instances }) {
    this.clientMethod = await instances.publicServerFunctions.serverFunction({ number: 34 })
    this.clientStatic = await PublicServerFunctions.serverFunction({ number: 34 })
  }

  render() {
    return (
      <div
        data-client-method={this.clientMethod === 69}
        data-server-method={this.serverMethod === 69}
        data-client-static={this.clientStatic === 69}
        data-server-static={this.serverStatic === 69}
      />
    )
  }

}

export default ExternalServerFunctions;