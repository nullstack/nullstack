import Nullstack from 'nullstack';

class TwoWayBindingsExternalComponent extends Nullstack {

  render({ bind }) {
    return (
      <div>
        <input bind={bind} name="external" />
      </div>
    )
  }

}

export default TwoWayBindingsExternalComponent;