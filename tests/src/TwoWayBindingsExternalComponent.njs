import Nullstack from 'nullstack';

class TwoWayBindingsExternalComponent extends Nullstack {

  render({ bind }) {
    return (
      <div>
        <input bind={bind} name="externalComponent" />
      </div>
    )
  }

}

export default TwoWayBindingsExternalComponent;