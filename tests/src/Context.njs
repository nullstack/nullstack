import Nullstack from 'nullstack';

class Context extends Nullstack {

  frameworkInitial = '';

  static async setContextKey(context) {
    context.framework = 'Nullstack';
  }

  static async getContextKey({framework}) {
    return framework;
  }

  async initiate(context) {
    await this.setContextKey();
    context.framework = await this.getContextKey();
    this.setFrameworkInitial();
  }

  setFrameworkInitial({framework}) {
    this.frameworkInitial = framework[0];
  }
  
  render({framework}) {
    return (
      <div>
        <div data-framework={framework} />
        <div data-framework-initial={this.frameworkInitial} />
      </div>
    )
  }

}

export default Context;