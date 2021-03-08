import Nullstack from 'nullstack';

class ParentComponent extends Nullstack {
  
  static async getParentThis() {
    return this.name;
  }

  async initiate() {
    this.parentThis = await this.getParentThis();
  }

  async hydrate() {
    this.hydratedParentThis = await this.getParentThis();
  }

  renderInnerComponent() {
    return (
      <div>
        <div data-current="ParentComponent" />
        <div data-parent-this={this.parentThis} />
        <div data-hydrated-parent-this={this.hydratedParentThis} />
      </div>
    )
  }

  render() {
    return (
      <div> <InnerComponent /> </div>
    )
  }

}

export default ParentComponent;