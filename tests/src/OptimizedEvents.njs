import Nullstack from 'nullstack'

class OptimizedEvents extends Nullstack {

  count = 0

  clickWhenEven() {
    this.lastClick = 'even'
  }

  clickWhenOdd() {
    this.lastClick = 'odd'
  }

  incrementCount() {
    this.count++
  }

  doubleCount({ data }) {
    this.count += data.count
  }

  eventAfterRendered() {
    this.worksAfterRender = true
  }

  render() {
    return (
      <main data-hydrated={this.hydrated}>
        {this.count === 1 && (
          <div>
            <button
              onclick={this.eventAfterRendered}
              data-works-after-rendered={this.worksAfterRender}
              data-after-render
            >
              after render
            </button>
          </div>
        )}
        <button onclick={() => (this.count = 10 + this.count)} data-set-count>
          add 10
        </button>
        <button
          onclick={this.count % 2 === 0 ? this.clickWhenEven : this.clickWhenOdd}
          data-last-click={this.lastClick}
          data-even-odd
        >
          even odd
        </button>
        <button onclick={this.count === 0 ? this.incrementCount : undefined} data-zero-only-increment>
          zero only
        </button>
        {this.count === 0 ? (
          <button onclick={this.incrementCount} data-zero-nothing-increment>
            zero only
          </button>
        ) : (
          <button data-zero-nothing-increment> nothing </button>
        )}
        <button onclick={this.incrementCount} data-increment-count>
          increment
        </button>
        <button onclick={this.doubleCount} data-count={this.count} data-double-count>
          double
        </button>
      </main>
    )
  }

}

export default OptimizedEvents
