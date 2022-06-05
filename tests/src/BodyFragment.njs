import Nullstack from 'nullstack';

class BodyFragment extends Nullstack {

  count = 0
  visible = false
  objected = false

  increment() {
    this.count++
  }

  reveal() {
    this.visible = !this.visible
  }

  countDataKeys({ data }) {
    this.hasDataKeys = Object.keys(data).length > 0
  }

  render() {
    return (
      <body data-chars="a" onclick={[this.increment, this.countDataKeys, { objected: true }]} data-count={this.count} class={["class-one", "class-two", false]} style="background-color: black;" data-keys={this.hasDataKeys} data-hydrated={this.hydrated}>
        <body data-chars="b" data-numbers="0" data-count={this.count} onclick={this.reveal} class="class-three class-four" style="color: white;" data-objected={this.objected}>
          BodyFragment
        </body>
        {this.visible &&
          <body data-visible data-has-visible={this.hasDataVisible}>
            BodyFragment2
          </body>
        }
        <a href="/">home</a>
      </body>
    )
  }

}

export default BodyFragment;