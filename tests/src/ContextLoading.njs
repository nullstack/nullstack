import Nullstack from 'nullstack';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ContextLoading extends Nullstack {

  static async serverFunctionName() {
    await sleep(1000);
  }

  async invokeServerFunction() {
    await this.serverFunctionName();
  }
  
  render({worker}) {
    console.log(worker.loading.serverFunctionName);
    return (
      <div> 
        <button onclick={this.invokeServerFunction}> Invoke </button>
        <div data-loading={!!worker.loading} />
        <div data-loading-function={!!worker.loading.serverFunctionName} />
      </div>
    )
  }

}

export default ContextLoading;