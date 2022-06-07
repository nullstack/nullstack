import Nullstack from 'nullstack';

class ArrayAttributes extends Nullstack {

  classes = 'c'
  styles = 'color: black;'
  count = 1
  objected = false

  increment() {
    this.count++
  }

  double() {
    this.count += this.count
  }

  render() {
    return (
      <div data-count={this.count} data-objected={this.objected} data-hydrated={this.hydrated}>
        <span class={this.classes}> {JSON.stringify(this.classes)} </span>
        <span style={this.styles}> {JSON.stringify(this.styles)} </span>
        <button onclick={{ classes: 'd' }} data-d>d</button>
        <button onclick={{ classes: ['a', 'b'] }} data-ab>a b</button>
        <button onclick={{ classes: ['a', 'b', 'c'] }} data-abc>a b c</button>
        <button onclick={{ classes: ['e', false && 'f', undefined && 'f', null && 'f', 0 && 'f'] }} data-e>e</button>
        <button onclick={{ styles: 'color: purple;' }} data-purple>purple</button>
        <button onclick={{ styles: ['color: pink;', 'background-color: blue;'] }} data-pink-blue>pink-blue</button>
        <button onclick={{ styles: ['color: pink;', 'background-color: blue; border: 1px solid red;'] }} data-pink-blue-red>pink-blue-red</button>
        <button onclick={{ styles: ['color: green;', false && 'background-color: blue;', undefined && 'background-color: blue;', null && 'background-color: blue;', 0 && 'background-color: blue;'] }} data-green>green</button>
        <button onclick={[this.increment, this.double, { objected: true }]} data-events>{this.count}</button>
        {this.count > 1 && <span class={['dynamic-a', 'dynamic-b']} style={['color: pink;', 'background-color: blue;']} />}
      </div>
    )
  }

}

export default ArrayAttributes;