import Nullstack from 'nullstack';

const AnonComponent = function(context) {
  return (
    <div data-anon={context.params.works} id={context.id} />
  )
}

function NamedComponent(context) {
  return (
    <div data-named={context.params.works} id={context.id} />
  )
}

const ArrowComponent = (context) => {
  return (
    <div data-arrow={context.params.works} id={context.id} />
  )
}

class Component extends Nullstack {

  renderInnerComponent(context) {
    return (
      <div data-inner={context.params.works} id={context.id} />
    )
  }
  
  render() {
    return (
      <>
        <AnonComponent id="anon" />
        <NamedComponent id="named" />
        <ArrowComponent id="arrow" />
        <InnerComponent id="inner" />
      </>
    )
  }

}

export default Component;