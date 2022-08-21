import Nullstack from 'nullstack';

class ContextData extends Nullstack {

  calculateWithDefault({ data }) {
    this.countWithDefault = data.multiplyBy * data.count;
  }

  calculateWithoutDefault({ data }) {
    this.countWithoutDefault = data.setTo;
  }

  render() {
    return (
      <div data-count-with-default={this.countWithDefault} data-count-without-default={this.countWithoutDefault}>
        <button onclick={this.calculateWithDefault} data-multiply-by={3} data={{ count: 2 }}>
          calculateWithDefault
        </button>
        <button onclick={this.calculateWithoutDefault} data-set-to={2}>
          calculateWithoutDefault
        </button>
      </div>
    )
  }

}

export default ContextData;