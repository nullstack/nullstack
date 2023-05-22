import Nullstack from 'nullstack';

class NestedComponent extends Nullstack {

  boolean = false
    
  render({ source, onchange, id }) {
    return (
      <div>
        <button source={source} onclick={onchange} id={id}>Inner: {this.boolean.toString()}</button>
      </div>  
    )
  }

}

class ObjectEventScope extends Nullstack {

  boolean = false
  visible = false
  
  render() {
    return (
      <div data-hydrated={this.hydrated} data-boolean={this.boolean}> 
        <NestedComponent onchange={{boolean: true}} id="render-single-object" />
        <NestedComponent onchange={[{ boolean: true }]} id="render-object-array" />
        <p>----</p>
        <button onclick={{visible: true}} id="rerender">show</button>
        {this.visible && 
          <div>
            <NestedComponent onchange={{ boolean: true }} id="rerender-single-object" />
            <NestedComponent onchange={[{ boolean: true }]} id="rerender-object-array" />
          </div>
        }
        <p>----</p>
        <p>Outter: {this.boolean.toString()}</p>
      </div>
    )
  }

}

export default ObjectEventScope;