import Nullstack from 'nullstack';

class StatefulComponent extends Nullstack {

  count = 1;
  object = { count: 0 };
  prepared = 0;
  date = new Date('1992-10-16');
  empty = '';
  visible = false;

  prepare() {
    this.prepared++;
  }

  increment({ by }) {
    this.count += by;
  }

  incrementByOne() {
    this.count++;
  }

  render() {
    return (
      <form ref={this._element} data-zero={0} data-hydrated-zero={this.hydrated ? 0 : 1}>
        <style>
          {`
            style { 
              display: none !important;
            }
            button { 
              background-color: rgba(0,0,0, ${this.count * 0.1});
              color: red;
              border: 0;
              padding: 10px;
            }
          `}
        </style>
        {this.hydrated &&
          <div data-tag={this._element.tagName.toLowerCase()} />
        }
        <button class="increment-by-one" onclick={this.incrementByOne}>
          +1
        </button>
        <button class="increment-by-two" onclick={this.increment} by={2}>
          +2
        </button>
        <button class="set-to-one" onclick={{ count: 1 }}>
          =1
        </button>
        <button class="set-object-to-one" source={this.object} onclick={{ count: 1 }}>
          =1
        </button>
        <p data-empty={this.empty}>{this.empty}</p>
        <button onclick={{ empty: 'not' }} data-fill> fill </button>
        <>
          <div data-prepared={this.prepared} />
          <div data-count={this.count} />
          <div data-object-count={this.object.count} />
          <div data-year={this.date.getFullYear()} />
        </>
        <button onclick={{ visible: !this.visible }} data-toggle> Toggle </button>
        {this.visible && <button onclick={undefined} data-undefined-event> button </button>}
        <textarea> {this.count} {this.count} </textarea>
      </form>
    )
  }

}

export default StatefulComponent;