import Nullstack from 'nullstack';

class Element extends Nullstack {
  
  render() {
    return (
      <> 
        <element tag="b" data-tag="b">b</element>
        <element data-tag="fragment">
          <element tag="abbr" data-tag="abbr">abbr</element>
        </element>
      </>
    )
  }

}

export default Element;