import Nullstack from 'nullstack';

class StatefulComponent extends Nullstack {

  count = 1;
  object = {count: 0};
  prepared = 0;
  date = new Date('1992-10-16');

  prepare() {
    this.prepared++;
  }

  increment({by}) {
    this.count += by;
  }

  incrementByOne() {
    this.count++;
  }
  
  render({self}) {
    return (
      <form> 
        {self.hydrated &&
          <div data-tag={self.element.tagName.toLowerCase()} />
        }
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
        <>
          <div data-prepared={this.prepared} />
          <div data-count={this.count} />
          <div data-object-count={this.object.count} />
          <div data-year={this.date.getFullYear()} />
        </>
      </form>
    )
  }

}

export default StatefulComponent;