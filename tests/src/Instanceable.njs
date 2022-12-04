import Nullstack from 'nullstack'

class Instanceable extends Nullstack {

  title = {
    title: 'Nullstack!',
    prepare: 'Prepared!',
    hydrate: 'Hydrated!',
  }

  serverLoaded = false

  static async getData() {
    return 'Nullstack! Nullstack!'
  }

  async changeInstance({ thisInstances, title }) {
    const { instanceable } = thisInstances
    instanceable.title[title] += ` ${instanceable.title[title]}`
  }

  prepare({ instances }) {
    this.changeInstance({
      thisInstances: instances,
      title: 'prepare',
    })
  }

  async hydrate({ instances }) {
    this.changeInstance({
      thisInstances: instances,
      title: 'hydrate',
    })
  }

  async customMethod({ instances }) {
    const title = await this.getData()
    const { instanceable } = instances
    instanceable.title.title = title
    instanceable.serverLoaded = true
  }

  renderTitle({ title }) {
    return (
      title[0] !== '_isProxy' && (
        <p data-title={title[0]} data-hydrated={this.hydrated}>
          {this.title[title[0]]}
        </p>
      )
    )
  }

  render({ instances }) {
    const { application } = instances
    const mainHasKey = application && typeof application.changeInstanceable === 'function'
    return (
      <div>
        {application && (
          <button data-change-instanceable={this.serverLoaded} onclick={application.changeInstanceable}>
            Mess with "instanceable" from Main
          </button>
        )}
        <div>
          {Object.entries(this.title).map((title) => (
            <Title title={title} />
          ))}
        </div>
        <p data-application-key={mainHasKey} />
        <div data-key={this.key} />
      </div>
    )
  }

}

export default Instanceable
