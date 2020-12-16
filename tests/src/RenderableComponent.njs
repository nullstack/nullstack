import Nullstack from 'nullstack';

class RenderableComponent extends Nullstack {

  condition = false;
  list = [1, 2, 3, 4, 5, 6];
  html = '<a href="https://nullstack.app"> Nullstack </a>';

  renderInnerComponent({children}) {
    return (
      <div class="InnerComponent">
        <p> Inner Component </p>
        {children}
      </div>
    )
  }

  renderFalsy() {
    return false;
  }

  transform() {
    this.condition = true;
    this.list = [1,2,3];
  }
  
  render() {
    return (
      <div class="RenderableComponent">
        <Falsy />
        <div> this is a normal tag </div>
        <label for="input"> label </label>
        <button disabled> disabled button </button>
        <button class="conditionally-disabled" disabled={this.condition}>
          conditionally disabled button
        </button>
        <element class="element" tag={this.condition ? 'div' : 'span'}>
          element tag
        </element>
        <InnerComponent> 
          <span class="children"> children </span>
        </InnerComponent>
        <ul>
          {this.list.map((item) => <li> {item} </li>)}
        </ul>
        <div html={this.html} />
        <head>
          <link rel="preload" href="https://nullstack.app" as="fetch" crossorigin />
        </head>
        <button class="transform" onclick={this.transform} data-condition={this.condition}> 
          toggle condition
        </button>
        {this.condition && 
          <div class="condition"> conditionally rendered div </div>
        }
      </div>
    )
  }

}

export default RenderableComponent;