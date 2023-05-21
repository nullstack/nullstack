import Nullstack from 'nullstack'

class HtmlFragment extends Nullstack {

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
      <div data-html-parent>
        <html
          data-chars="a"
          onclick={[this.increment, this.countDataKeys, { objected: true }]}
          data-count={this.count}
          class={['class-one', 'class-two', false]}
          style="background-color: black;"
          data-keys={this.hasDataKeys}
          data-hydrated={this.hydrated}
        >
          <html
            data-chars="b"
            data-numbers="0"
            data-count={this.count}
            onclick={this.reveal}
            class="class-three class-four"
            style="color: white;"
            data-objected={this.objected}
          >
            HtmlFragment
          </html>
          {this.visible && (
            <html data-visible data-has-visible={this.hasDataVisible}>
              HtmlFragment2
            </html>
          )}
          <a href="/" data-html-child>home</a>
        </html>
      </div>
    )
  }

}

export default HtmlFragment
