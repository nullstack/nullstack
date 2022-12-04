import Nullstack from 'nullstack'

import { clientOnly, clientOnly as clientOnlyAlias, serverOnly, serverOnly as serverOnlyAlias } from './helpers'
import * as namespacedImport from './helpers'

class IsomorphicImport extends Nullstack {

  static async serverFunction() {
    return {
      serverOnly: serverOnly(),
      serverOnlyAlias: serverOnlyAlias(),
      namespacedServerOnly: namespacedImport.serverOnly(),
    }
  }

  async initiate() {
    const data = await this.serverFunction()
    Object.assign(this, data)
    this.clientOnly = clientOnly()
    this.clientOnlyAlias = clientOnlyAlias()
  }

  render() {
    return (
      <div
        data-hydrated={this.hydrated}
        data-server-only={this.serverOnly}
        data-server-only-alias={this.serverOnlyAlias}
        data-client-only={this.clientOnly}
        data-client-only-alias={this.clientOnlyAlias}
        data-namespaced-server-only={this.namespacedServerOnly}
      />
    )
  }

}

export default IsomorphicImport
