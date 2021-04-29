import Nullstack from 'nullstack';

class RenderableComponent extends Nullstack {

  renderNestedInnerComponent() {
    return <div data-nested />
  }

  renderSvg({showSVG}) {
    return (
      showSVG ? <svg width={"10px"} height={"10px"} viewBox="0 0 512 512" class="hidden-svg">
      <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur={"1.0s"} additive="sum" repeatCount="indefinite" />
      <path d="M498.415,183.1125,341.0187,159.07,270.4665,8.7987c-5.2706-11.224-23.6773-11.224-28.948,0L170.9863,159.07,13.59,183.1125a15.9932,15.9932,0,0,0-9.02,26.9894L118.9142,327.3048,91.8821,493.0039a16.0119,16.0119,0,0,0,23.5321,16.572l140.5883-77.6922,140.5884,77.7136c11.516,6.4013,25.704-3.2867,23.532-16.5734l-27.032-165.6977,114.3442-117.203a16.014,16.014,0,0,0-9.02-27.0107Zm0,0" transform="translate(0 0)" fill={"blue"}/>
    </svg> : <svg width={"10px"} height={"10px"} viewBox="0 0 512 512" class="showing-svg">
        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur={"1.0s"} additive="sum" repeatCount="indefinite" />
        <path d="M488.9457,185.96l-151.248-23.1035L269.9014,18.455c-5.0648-10.7855-22.7524-10.7855-27.8173,0L174.3072,162.8561,23.0591,185.96a15.3685,15.3685,0,0,0-8.6677,25.9352L124.2691,324.52,98.293,483.7459a15.3864,15.3864,0,0,0,22.6128,15.9247l135.0966-74.6573L391.099,499.6911a15.3868,15.3868,0,0,0,22.6128-15.9259L387.7357,324.54,497.6134,211.9153a15.3885,15.3885,0,0,0-8.6677-25.9557Zm0,0" transform="translate(0 0)" fill="none" stroke={"blue"} stroke-linecap="round" stroke-linejoin="round" stroke-width={20}/>
      </svg>
    )
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
        <div>
          <Svg showSVG={params.showSVG} />
        </div>
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