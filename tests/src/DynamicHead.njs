import Nullstack from 'nullstack'

class DynamicHead extends Nullstack {

  count = 0
  negativeCount = 0

  renderHead() {
    const innerComponent = `[data-inner-component] { color: blue }`
    return <style html={innerComponent} data-inner-component />
  }

  render() {
    const color = this.count % 2 === 0 ? 'red' : 'blue'
    const redBlue = `[data-red-blue] { color: ${color}}`
    const prerenderConditional = `[data-prerender-conditional] { color: blue }`
    const rerenderConditional = `[data-rerender-conditional] { color: blue }`
    const fragment = `[data-fragment] { color: blue }`
    const conditionalHead = `[data-conditional-head] { color: blue }`
    const dynamicLength = `[data-dynamic-length] { color: blue }`
    return (
      <div>
        <head>
          <style html={redBlue} data-count={this.count} data-red-blue />
          {this.count === 0 && <style html={prerenderConditional} data-prerender-conditional />}
          {this.count === 1 && <style html={rerenderConditional} data-rerender-conditional />}
          <>
            <style html={fragment} data-fragment />
          </>
          <Head />
        </head>
        {this.count === 1 && (
          <head>
            <style html={conditionalHead} data-conditional-head />
          </head>
        )}
        <head>
          {this.count % 2 === 0 ? (
            <style html="" data-ternary-head-children />
          ) : (
            <meta name="test" content="nullstack" data-ternary-head-children />
          )}
        </head>
        <head>
          {Array(this.count + 1 - this.negativeCount).fill(
            <style
              html={dynamicLength}
              data-dynamic-length={this.count}
              data-negative-count={this.negativeCount === 1}
            />,
          )}
        </head>
        <button onclick={{ count: this.count + 1 }} data-increment>
          {' '}
          inc {this.count}{' '}
        </button>
        <button onclick={{ negativeCount: this.negativeCount + 1 }} data-decrement>
          {' '}
          dec {this.negativeCount}{' '}
        </button>
        <span data-red-blue> data-red-blue </span>
        <span data-prerender-conditional> data-prerender-conditional </span>
        <span data-rerender-conditional> data-rerender-conditional </span>
        <span data-fragment> data-fragment </span>
        <span data-conditional-head> data-conditional-head </span>
        <span data-inner-component> data-inner-component </span>
        {this.count % 2 === 0 ? (
          <head>
            <meta name="test" content="nullstack" data-ternary-head id="ternary-head" />
          </head>
        ) : (
          <span data-ternary-span> not head </span>
        )}
        {this.count % 2 === 0 ? (
          <head>
            <meta name="test" content="nullstack" data-a1 />
          </head>
        ) : (
          <head>
            <meta name="test" content="nullstack" data-b1 />
            <meta name="test" content="nullstack" data-b2 />
          </head>
        )}
      </div>
    )
  }

}

export default DynamicHead
