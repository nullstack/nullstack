import Nullstack from 'nullstack';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ContextLoading extends Nullstack {

  static async serverFunctionName() {
    await sleep(3000);
  }

  async invokeServerFunction() {
    await this.serverFunctionName();
  }
  
  render({loading}) {
    return (
      <div> 
        <button onclick={this.invokeServerFunction}> Invoke </button>
        <div data-loading={!!loading} />
        <div data-loading-function={loading.serverFunctionName} />
      </div>
    )
  }

}

export default ContextLoading;