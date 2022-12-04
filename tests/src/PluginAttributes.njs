import Nullstack from 'nullstack'

class PluginAttributes extends Nullstack {

  title = 'Nullstack';
  showTitle = true
  pluginInServer = false
  pluginInClient = false
  accessInLoad = false
  accessInTransform = false

  prepare({ pluginData }) {
    this.pluginInServer = pluginData.changedServer
  }

  hydrate({ pluginData }) {
    this.pluginInClient = pluginData.changedClient
    this.accessInLoad = pluginData.accessInLoad
    this.accessInTransform = pluginData.accessInTransform
  }

  boldTitle() {
    return `<b>${this.title}</b>`
  }

  renderVueablePlugin() {
    return (
      <div>
        <h1 v-if={this.showTitle} v-html={this.boldTitle()} data-vue />

        <button data-btn={(!this.showTitle).toString()} onclick={{ showTitle: !this.showTitle }}>
          Toggle title
        </button>

        <p data-changed-server={this.pluginInServer} />
        <p data-changed-client={this.pluginInClient} />

        <p data-access-load={this.accessInLoad} />
        <p data-access-transform={this.accessInTransform} />
      </div>
    )
  }

  render() {
    return (
      <div>
        <VueablePlugin />
      </div>
    )
  }

}

export default PluginAttributes
