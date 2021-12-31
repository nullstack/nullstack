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
    this.hydratedParentThis = await this.getParentThis();
    this.hydratedChildThis = await this.getChildThis();
    console.log(this.constructor.name, this.hydratedParentThis, this.hydratedParentThis == this.constructor.name)
    this.bunda = 'true'
  }

  renderInnerComponent() {
    return (
      <div>
        <div data-current="ChildComponent" />
        <div data-parent-this={this.parentThis === this.constructor.name} />
        <div data-child-this={this.childThis === this.constructor.name} />
        <div data-hydrated-parent-this={this.hydratedParentThis === this.constructor.name} />
        <div data-hydrated-child-this={this.hydratedChildThis === this.constructor.name} />
        {this.constructor.name} {this.hydratedParentThis} {String(this.hydratedParentThis === this.constructor.name)}
      </div>
    )
  }

}

export default ChildComponent;