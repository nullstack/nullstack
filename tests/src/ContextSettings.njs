import Nullstack from 'nullstack';

class ContextSettings extends Nullstack {

  settings = {};

  static async start({ settings }) {
    settings.anyEnvironment = 'settings';
  }

  render({ settings }) {
    return (
      <div>
        <div data-settings={!!settings} />
        <div data-key={settings.key} />
        <div data-camelized-key={settings.camelizedKey} />
        <div data-any-environment={settings.anyEnvironment} />
      </div>
    )
  }

}

export default ContextSettings;