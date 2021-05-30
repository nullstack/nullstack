import Nullstack from 'nullstack';

class ErrorOnChildNode extends Nullstack {
  testValue = 'initial Value';
  testClick() {
    this.testValue = 'Changed Value';
  }
  render() {
    return (
      <>
        <h1> Table Error </h1>
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
        <div id="text">
        {this.testValue}
        </div>
        <button id="buttonTest" onclick={this.testClick}> Change Value </button>
      </>
    );
  }
}

export default ErrorOnChildNode;
