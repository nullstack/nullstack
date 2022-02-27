import Nullstack from 'nullstack';

class ObjectId {

  constructor(id) {
    this.id = id
  }

  toJSON() {
    return this.id;
  }

}

class ErrorOnChildNode extends Nullstack {

  testValue = 'initial Value';

  records = [
    { _id: new ObjectId('a') },
  ]

  testClick() {
    this.testValue = 'Changed Value';
  }

  renderSerializationError() {
    const records = this.records.filter((r) => r._id === 'a')
    if (!records.length) return false;
    return (
      <div>
        {records.map((record) => <div>{record._id}</div>)}
      </div>
    )
  }

  renderDOMError() {
    return (
      <table>
        <thead>
          <th>No.</th>
          <th>Fisrt Name</th>
          <th>Last Name</th>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Jeanette</td>
            <td>Penddreth</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Giavani</td>
            <td>Frediani</td>
          </tr>
        </tbody>
      </table>
    )
  }

  render({ params }) {
    return (
      <>
        <h1> Table Error </h1>
        {params.serialization && <SerializationError />}
        {params.dom && <DOMError />}
        <div id="text">
          {this.testValue}
        </div>
        <button id="buttonTest" onclick={this.testClick}> Change Value </button>
      </>
    );
  }
}

export default ErrorOnChildNode;
