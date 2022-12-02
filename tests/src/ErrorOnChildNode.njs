import Nullstack from 'nullstack'

class ObjectId {

  constructor(id) {
    this.id = id
  }

  toJSON() {
    return this.id
  }

}

class ErrorOnChildNode extends Nullstack {

  value = 'initial Value'

  records = [{ _id: new ObjectId('a') }]

  testClick() {
    this.value = 'Changed Value'
  }

  renderSerializationError() {
    const records = this.records.filter((r) => r._id === 'a')
    if (!records.length) return false
    return (
      <div>
        {records.map((record) => (
          <div>{record._id}</div>
        ))}
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
        <h2> Table Error </h2>
        {params.serialization && <SerializationError />}
        {params.dom && <DOMError />}
        <div data-value={this.value}>{this.value}</div>
        <button data-dom-error onclick={this.testClick}>
          {' '}
          Change Value{' '}
        </button>
      </>
    )
  }

}

export default ErrorOnChildNode
