import Nullstack from 'nullstack'

class WindowFragment extends Nullstack {

  count = 0
  visible = false
  objected = false

  increment() {
    this.count++
  }

  reveal() {
    this.visible = !this.visible
  }

  render() {
    return (
      <div data-window-parent data-count={this.count} data-objected={this.objected} data-hydrated={this.hydrated}>
        <window
          onclick={[this.increment, () => console.log('hi'), {objected: true}]}
        >
          {this.hydrated && <div data-hydrated />}
          <window onclick={this.reveal}>
            WindowFragment
          </window>
          {this.visible && (
            <window onclick={this.lol}>
              <div data-visible>
                WindowFragment2
              </div>
            </window>
          )}
          <a href="/" data-window-child>home</a>
        </window>
      </div>
    )
  }

}

export default WindowFragment
