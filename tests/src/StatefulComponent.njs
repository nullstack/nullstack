import Nullstack from 'nullstack';

class StatefulComponent extends Nullstack {

  count = 1;
  object = {count: 0};

  increment({by}) {
    this.count += by;
  }

  incrementByOne() {
    this.count++;
  }
  
  render() {
    return (
      <form> 
        <button class="increment-by-one" onclick={this.incrementByOne}>
          +1
        </button>
        <button class="increment-by-two" onclick={this.increment} by={2}>
          +2
        </button>
        <button class="set-to-one" onclick={{count: 1}}>
          =1
        </button>
        <button class="set-object-to-one" source={this.object} onclick={{count: 1}}>
          =1
        </button>
        <span data-count={this.count}> {this.count} </span>
        <span data-object-count={this.object.count}> {this.object.count} </span>
      </form>
    )
  }

}

export default StatefulComponent;