import Nullstack from 'nullstack';

class IsomorphicStartup extends Nullstack {

  static async getServerStartValue({ startValue }) {
    return startValue;
  }

  async initiate() {
    this.serverStartValue = await this.getServerStartValue()
  }

  render({ startValue, startTimedValue }) {
    return (
      <div
        data-server-start-value={this.serverStartValue}
        data-client-start-value={startValue}
        data-client-start-timed-value={startTimedValue}
      />
    )
  }

}

export default IsomorphicStartup;