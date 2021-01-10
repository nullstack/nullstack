import Nullstack from 'nullstack';

class StaticRendering extends Nullstack {

  renderInnerInnerComponent() {
    return (
      <div render-inner-inner-name={this.name} />
    )
  }

  renderInnerComponent() {
    return (
      <div render-inner-name={this.name}> <InnerInnerComponent /> </div>
    )
  }
  
  render() {
    return (
      <div render-name={this.name}> <InnerComponent /> </div>
    )
  }

}

export default StaticRendering;