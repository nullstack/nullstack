import Nullstack from 'nullstack';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ContextWorker extends Nullstack {

  static async serverFunctionName() {
    await sleep(1000);
  }

  async invokeServerFunction() {
    await this.serverFunctionName();
  }

  static async start({worker}) {
    worker.enabled = true;
    worker.preload = ['/context-worker'];
  }
  
  render({worker}) {
    return (
      <div> 
        <button onclick={this.invokeServerFunction}> Invoke </button>
        <div data-worker={!!worker} />
        <div data-enabled={worker.enabled} />
        <div data-online={worker.online} />
        <div data-fetching={worker.fetching} />
        <div data-responsive={worker.responsive} />
        <div data-preload={!!worker.preload} />
        <div data-preload-path={worker.preload[0]} />
        {worker.registration &&
          <div data-registration={worker.registration.constructor.name} />
        }
        {worker.installation &&
          <div data-installation={worker.installation.constructor.name} />
        }
      </div>
    )
  }

}

export default ContextWorker;