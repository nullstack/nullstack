import Nullstack from 'nullstack';

class ContextSecrets extends Nullstack {

  secrets = {};

  static async start({ secrets }) {
    secrets.anyEnvironment = 'secrets';
  }

  static async leakSecrets({ secrets }) {
    return secrets;
  }

  async initiate() {
    this.secrets = await this.leakSecrets();
  }

  render({ secrets }) {
    return (
      <div>
        <div data-secrets={!!secrets} />
        <div data-key={this.secrets.key} />
        <div data-camelized-key={this.secrets.camelizedKey} />
        <div data-any-environment={this.secrets.anyEnvironment} />
      </div>
    )
  }

}

export default ContextSecrets;