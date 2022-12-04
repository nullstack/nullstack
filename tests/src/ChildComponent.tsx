import ParentComponent from './ParentComponent'

class ChildComponent extends ParentComponent {

  static async getChildThis() {
    return this.name
  }

  async initiate() {
    this.parentThis = await this.getParentThis()
    this.childThis = await this.getChildThis()
    this.staticChildThis = await ChildComponent.getChildThis()
    this.staticParentThis = await ParentComponent.getParentThis()
  }

  async hydrate() {
    this.hydratedParentThis = await this.getParentThis()
    this.hydratedChildThis = await this.getChildThis()
    this.staticHydratedChildThis = await ChildComponent.getChildThis()
    this.staticHydratedParentThis = await ParentComponent.getParentThis()
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
        <div data-static-child-this={this.staticChildThis === this.constructor.name} />
        <div data-static-parent-this={this.staticParentThis === ParentComponent.name} />
        <div data-static-hydrated-child-this={this.staticHydratedChildThis === this.constructor.name} />
        <div data-static-hydrated-parent-this={this.staticHydratedParentThis === ParentComponent.name} />
        {this.constructor.name} {this.hydratedParentThis} {String(this.hydratedParentThis === this.constructor.name)}
      </div>
    )
  }

}

export default ChildComponent
