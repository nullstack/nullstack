import ParentComponent from './ParentComponent';

class ChildComponent extends ParentComponent {

  static async getChildThis() {
    return this.name;
  }

  async initiate() {
    this.parentThis = await this.getParentThis();
    this.childThis = await this.getChildThis();
  }

  async hydrate() {
    console.log('hydrate');
    this.hydratedParentThis = await this.getParentThis();
    this.hydratedChildThis = await this.getChildThis();
  }
  
  renderInnerComponent() {
    return (
      <div>
        <div data-current="ChildComponent" />
        <div data-parent-this={this.parentThis} />
        <div data-child-this={this.childThis} />
        <div data-hydrated-parent-this={this.hydratedParentThis} />
        <div data-hydrated-child-this={this.hydratedChildThis} />
      </div>
    )
  }

}

export default ChildComponent;