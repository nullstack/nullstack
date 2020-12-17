import Nullstack from 'nullstack';

class ContextSettings extends Nullstack {

  settings = {};

  static async start({settings}) {
    settings.anyEnvironment = 'settings';
    settings.development.developmentOnly = 'settings';
    settings.production.productionOnly = 'settings';
  }
  
  render({settings}) {
    return (
      <div> 
        <div data-settings={!!settings} />
        <div data-key={settings.key} />
        <div data-camelized-key={settings.camelizedKey} />
        <div data-any-environment={settings.anyEnvironment} />
        <div data-development-only={settings.developmentOnly} />
        <div data-production-only={settings.productionOnly} />
      </div>
    )
  }

}

export default ContextSettings;