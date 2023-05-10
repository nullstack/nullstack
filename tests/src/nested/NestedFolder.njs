import Nullstack from 'nullstack'
import LazyComponent from '../LazyComponent'

class NestedFolder extends Nullstack {

  render() {
    return (
      <div>
        NestedFolder
        <LazyComponent />
      </div>
    )
  }

}

export default NestedFolder;