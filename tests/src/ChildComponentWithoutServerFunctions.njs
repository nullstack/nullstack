import ParentComponent from './ParentComponent'

class ChildComponentWithoutServerFunctions extends ParentComponent {

  async initiate() {
    this.parentThis = await this.getParentThis()
  }

  async hydrate() {
    this.hydratedParentThis = await this.getParentThis()
  }
  
  render() {
    return (
      <div>
        <div data-parent-this={this.parentThis === this.constructor.name} />
        <div data-hydrated-parent-this={this.hydratedParentThis === this.constructor.name} />
      </div>
    )
  }

}

export default ChildComponentWithoutServerFunctions