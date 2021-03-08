import Nullstack from 'nullstack';

class ContextData extends Nullstack {

  count = 1;

  calculate({data}) {
    this.count = (this.count * data.multiply) + data.sum;
  }

  renderInner({data}) {
    return (
      <div data={data}>
        {data.frameworkName}
      </div>
    )
  }
  
  render({data}) {
    return (
      <div> 
        <div data-data={!!data} />
        <button onclick={this.calculate} data-multiply={3} data={{sum: 2}}>
          ({this.count}*3) + 2
        </button>
        <div data-count={this.count} />
        <Inner data-framework-name="Nullstack" />
      </div>
    )
  }

}

export default ContextData;