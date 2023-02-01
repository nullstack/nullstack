import Nullstack from 'nullstack'

import { appendFileSync } from 'fs'

const error = new Error('Panic in the system, someone missconfigured me!')

class CatchError extends Nullstack {

  static async logError({ message, environment }) {
    const folder = environment.production ? '.production' : '.development'
    appendFileSync(`${folder}/exceptions.txt`, `${message}\n`)
  }

  static async getServerFunction() {
    throw error
  }

  async oneErrorPls() {
    throw error
  }

  async hydrate({ params }) {
    setTimeout(() => (this.hydrated = true), 0)
    if (params.error === 'hydrate') {
      await this.vaidamerdanoclient()
    }
  }

  async initiate({ params, page }) {
    if (params.error === 'initiate' && page.status === 200) {
      this.vaidamerdanoserver()
    } else if (params.error === 'initiateServerFunction') {
      await this.getServerFunction()
    }
  }

  render() {
    return (
      <div data-hydrated={this.hydrated}>
        <button onclick={this.oneErrorPls}> Error </button>
      </div>
    )
  }

}

export default CatchError
