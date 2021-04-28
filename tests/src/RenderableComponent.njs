import Nullstack from 'nullstack';

class RenderableComponent extends Nullstack {

  renderNestedInnerComponent() {
    return <div data-nested />
  }

  renderSvg({class: klass}) {
    return (<svg width={"1px"} height={"1px"} class={klass} viewBox="0 0 482 482">
    <path d="M124 124L358 358" stroke="currentColor" stroke-width="70.2055" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M358 124L124 358" stroke="currentColor" stroke-width="70.2055" stroke-linecap="round" stroke-linejoin="round" />
  </svg>)
  }

  renderInnerComponent({children}) {
    return (
      <div class="InnerComponent">
        <p> Inner Component </p>
        <NestedInnerComponent />
        {children}
      </div>
    )
  }

  renderFalsy() {
    return false;
  }
  
  render({params}) {
    const list = params.shortList ? [1,2,3] : [1, 2, 3, 4, 5, 6]
    const html = '<a href="/"> Nullstack </a>';
    return (
      <div class="RenderableComponent">
        <Falsy />
        <div data-object={{a: 1}} />
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
        <InnerComponent> 
          <span class="children"> children </span>
        </InnerComponent>
        <ul>
          {list.map((item) => <li> {item} </li>)}
        </ul>
        <div html={html} />
        <head>
          <link rel="preload" href="https://nullstack.app" as="fetch" crossorigin />
        </head>
        {!!params.condition && 
          <div class="condition"> conditionally rendered div </div>
        }
        { params.showSVG ? <Svg class="hidden-svg" /> : <Svg class="showing-svg" /> }
        <a params={{showSVG: true}} class="show-svg"> long list </a>
        <a params={{shortList: true}} class="short-list"> long list </a>
        <a params={{condition: true}} class="true-condition"> long list </a>
        <div data-condition={!!params.condition} />
        <div data-short-list={!!params.shortList} />
        <div data-name={this.name} />
      </div>
    )
  }

}

export default RenderableComponent;