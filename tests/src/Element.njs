import Nullstack from 'nullstack'

class ClassElement extends Nullstack {

  render({ prop }) {
    return <div data-class-component={prop} />
  }

}

function FunctionalElement({ prop }) {
  return <div data-functional-component={prop} />
}

class Element extends Nullstack {

  renderInnerElement({ prop }) {
    return <div data-inner-component={prop} />
  }

  render() {
    return (
      <>
        <element tag="b" data-tag="b">
          b
        </element>
        <element data-tag="fragment">
          <element tag="abbr" data-tag="abbr">
            abbr
          </element>
        </element>
        <element tag={InnerElement} prop />
        <element tag={ClassElement} prop />
        <element tag={FunctionalElement} prop />
      </>
    )
  }
}

export default Element
