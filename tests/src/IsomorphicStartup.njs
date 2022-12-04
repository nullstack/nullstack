import Nullstack from 'nullstack'

class IsomorphicStartup extends Nullstack {

  static async getServerStartValue({ startValue }) {
    return startValue
  }

  async initiate() {
    this.serverStartValue = await this.getServerStartValue()
  }

  static async getServerStartIncrementalValue({ startIncrementalValue }) {
    return startIncrementalValue
  }

  async hydrate() {
    this.startIncrementalValue = await this.getServerStartIncrementalValue()
  }

  render({ startValue, startTimedValue }) {
    return (
      <div
        data-server-start-value={this.serverStartValue}
        data-client-start-value={startValue}
        data-client-start-timed-value={startTimedValue}
        data-client-start-incremental-value={this.startIncrementalValue}
      />
    )
  }

}

export default IsomorphicStartup
