import Nullstack from 'nullstack'

const error = new Error('Panic in the system, someone missconfigured me!')

class CatchError extends Nullstack {

  static async getServerFunction() {
    throw error
  }

  async oneErrorPls() {
    throw error
  }

  async hydrate({ params }) {
    if (params.error === 'hydrate') {
      this.vaidamerda()
    }
  }

  async initiate({ params, page }) {
    if (params.error === 'initiate' && page.status === 200) {
      this.vaidamerda()
    } else if (params.error === 'initiateServerFunction') {
      await this.getServerFunction()
    }
  }

  render() {
    return (
      <div>
        <button onclick={this.oneErrorPls}> Error </button>
      </div>
    )
  }

}

export default CatchError
