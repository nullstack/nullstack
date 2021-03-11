import Nullstack from 'nullstack';

class Instanceable extends Nullstack {

  title = {
    title: 'Nullstack!',
    prepare: 'Prepared!',
    hydrate: 'Hydrated!'
  };
  serverLoaded = false;

  static async getData() {
    return 'Nullstack! Nullstack!';
  }

  async changeInstance({ thisInstances, title }) {
    const { Instanceable } = thisInstances;
    Instanceable.title[title] += ' ' + Instanceable.title[title];
  }

  prepare({ instances }) {
    this.changeInstance({
      thisInstances: instances,
      title: 'prepare'
    });
  }

  async hydrate({ instances }) {
    this.changeInstance({
      thisInstances: instances,
      title: 'hydrate'
    });
  }

  async customMethod({ instances }) {
    const title = await this.getData();
    const { Instanceable } = instances;
    Instanceable.title.title = title;
    Instanceable.serverLoaded = true;
  }

  renderTitle({ title }) {
    return (
      title[0] !== '_isProxy' &&
      <p data-title={title[0]}>
        {this.title[title[0]]}
      </p>
    )
  }

  render({ instances }) {
    return (
      <div>
        <button
          data-change-instanceable={this.serverLoaded.toString()}
          onclick={instances.application.changeInstanceable}
        >
          Mess with Instanceable from Main
        </button>
        <div>
          {Object.entries(this.title)
            .map(title => <Title title={title} />)
          }
        </div>
      </div>
    )
  }

}

export default Instanceable;