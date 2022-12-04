import Nullstack from 'nullstack'

class RenderableComponent extends Nullstack {

  renderNestedInnerComponent() {
    return <div data-nested />
  }

  renderInnerComponent({ children, reference: Reference }) {
    return (
      <div class="InnerComponent">
        <p> Inner Component </p>
        <NestedInnerComponent />
        <Reference prop />
        {children}
      </div>
    )
  }

  renderInnerReference({ prop }) {
    return <div data-reference={prop} />
  }

  renderFalsy() {
    return false
  }

  render({ params }) {
    const list = params.shortList ? [1, 2, 3] : [1, 2, 3, 4, 5, 6]
    const html = '<a href="/"> Nullstack </a>'
    return (
      <div class="RenderableComponent">
        <Falsy />
        <div data-object={{ a: 1 }} />
        <div data-function={RenderableComponent} />
        <div> this is a normal tag </div>
        <label for="input"> label </label>
        <button disabled> disabled button </button>
        <button class="conditionally-disabled" disabled={!!params.condition}>
          conditionally disabled button
        </button>
        <element class="element" tag={params.condition ? 'div' : 'span'}>
          element tag
        </element>
        <InnerComponent reference={InnerReference}>
          <span class="children"> children </span>
        </InnerComponent>
        <ul>
          {list.map((item) => (
            <li> {item} </li>
          ))}
        </ul>
        <div html={html} />
        <head>
          <link rel="preload" href="https://nullstack.app" as="fetch" crossorigin />
        </head>
        {!!params.condition && <div class="condition"> conditionally rendered div </div>}
        <a params={{ shortList: true }} class="short-list">
          {' '}
          long list{' '}
        </a>
        <a params={{ condition: true }} class="true-condition">
          {' '}
          long list{' '}
        </a>
        <div data-condition={!!params.condition} />
        <div data-short-list={!!params.shortList} />
        <div data-name={this.name} />
      </div>
    )
  }

}

export default RenderableComponent
