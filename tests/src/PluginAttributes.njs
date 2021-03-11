import Nullstack from 'nullstack';

class PluginAttributes extends Nullstack {
  
  title = 'Nullstack';
  showTitle = true;

  boldTitle() {
    return `<b>${this.title}</b>`;
  }

  renderVueablePlugin() {
    return (
      <div>
        <h1
          v-if={this.showTitle}
          v-html={this.boldTitle()}
          data-vue
        ></h1>

        <button
          data-btn={(!this.showTitle).toString()}
          onclick={{showTitle: !this.showTitle}}
        >
          Toggle title
        </button>
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

export default PluginAttributes;