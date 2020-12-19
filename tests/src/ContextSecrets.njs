import Nullstack from 'nullstack';

class ContextSecrets extends Nullstack {

  secrets = {};

  static async start({secrets}) {
    secrets.anyEnvironment = 'secrets';
    secrets.development.developmentOnly = 'secrets';
    secrets.production.productionOnly = 'secrets';
  }

  static async leakSecrets({secrets}) {
    return secrets;
  }

  async initiate() {
    this.secrets = await this.leakSecrets();
  }
  
  render({secrets}) {
    return (
      <div> 
        <div data-secrets={!!secrets} />
        <div data-key={this.secrets.key} />
        <div data-camelized-key={this.secrets.camelizedKey} />
        <div data-any-environment={this.secrets.anyEnvironment} />
        <div data-development-only={this.secrets.developmentOnly} />
        <div data-production-only={this.secrets.productionOnly} />
      </div>
    )
  }

}

export default ContextSecrets;