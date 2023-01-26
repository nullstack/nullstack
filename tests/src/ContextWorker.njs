import Nullstack from 'nullstack'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

class ContextWorker extends Nullstack {

  header = '';

  static async start({ worker }) {
    worker.enabled = true
    worker.preload = ['/context-worker']
  }

  static async inspectHeaders({ request }) {
    return request.headers.custom
  }

  async hydrate({ worker }) {
    worker.headers.custom = 'custom'
    this.header = await this.inspectHeaders()
  }

  static async longServerFunction() {
    await sleep(3000)
  }

  invokeServerFunction({ worker, id }) {
    this.longServerFunction({ id })
    this.didFetch = worker.fetching
  }

  render({ worker }) {
    return (
      <div data-hydrated={this.hydrated}>
        <button onclick={this.invokeServerFunction}> Invoke </button>
        <div data-header={this.header} />
        <div data-worker={!!worker} />
        <div data-enabled={worker.enabled} />
        <div data-online={worker.online} />
        <div data-fetching={this.didFetch} />
        <div data-responsive={worker.responsive} />
        <div data-preload={!!worker.preload} />
        <div data-preload-path={worker.preload[0]} />
        <div data-queues-length={worker.queues.longServerFunction.length} />
        <div data-cdn={worker.cdn} />
        <div data-queues={worker.queues.longServerFunction.map(({ id }) => id)?.join(',')} />
        <button onclick={this.invokeServerFunction} id="a">
          a
        </button>
        <button onclick={this.invokeServerFunction} id="b">
          b
        </button>
        {worker.registration && <div data-registration={worker.registration.constructor.name} />}
        {worker.installation && <div data-installation={worker.installation.constructor.name} />}
      </div>
    )
  }

}

export default ContextWorker
