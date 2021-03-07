import Nullstack from 'nullstack';
import { 
  AnonComponent, 
  NamedComponent, 
  ArrowComponent 
} from './PureFunctions';

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