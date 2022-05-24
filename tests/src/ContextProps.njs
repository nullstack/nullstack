import Nullstack from 'nullstack';

class ContextProps extends Nullstack {

  // should route be in the props? would make it weird to spread
  async initiate({ props }) {
    this.initiateProps = (
      Object.keys(props).length === 4 &&
      props.route === '/context-props' &&
      props.string === 'string' &&
      props.number === 1 &&
      props.boolean === true
    )
  }

  async hydrate({ props }) {
    this.hydrateProps = (
      Object.keys(props).length === 4 &&
      props.route === '/context-props' &&
      props.string === 'string' &&
      props.number === 1 &&
      props.boolean === true
    )
  }

  // inner component events have the component props + event props but not the inner component props (same as context). is it weird?
  // it would be expensive to keep track of both because would need traversing
  handleInnerComponentClick({ props }) {
    this.innerComponentEventProps = (
      Object.keys(props).length === 5 &&
      props.route === '/context-props' &&
      props.string === 'string' &&
      props.number === 1 &&
      props.boolean === true &&
      props['data-inner-component-event'] === true
    )
  }

  // should inner components have the props of the parent?
  renderInnerComponent({ props }) {
    const innerProps = (
      Object.keys(props).length === 5 &&
      props.route === '/context-props' &&
      props.string === 'string' &&
      props.number === 1 &&
      props.boolean === true &&
      props.inner === true
    )
    return (
      <div data-inner-props={innerProps} data-inner-component-event-props={this.innerComponentEventProps}>
        <button onclick={this.handleInnerComponentClick} data-inner-component-event> inner component event </button>
      </div>
    )
  }

  // should props be camelized?
  // should props replace data- so we deprecate data- ?
  handleComponentClick({ props }) {
    this.componentEventProps = (
      Object.keys(props).length === 5 &&
      props.route === '/context-props' &&
      props.string === 'string' &&
      props.number === 1 &&
      props.boolean === true &&
      props['data-component-event'] === true
    )
  }

  // its cool to be able to just do a spread of props
  render({ props }) {
    return (
      <div data-initiate-props={this.initiateProps} data-hydrate-props={this.hydrateProps} data-component-event-props={this.componentEventProps}>
        <button onclick={this.handleComponentClick} data-component-event> component event </button>
        <InnerComponent inner />
        <div {...props} />
      </div>
    )
  }

}

export default ContextProps;