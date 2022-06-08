import Nullstack from 'nullstack';

class TwoWayBindingsExternalComponent extends Nullstack {

  render({ bind }) {
    return (
      <div>
        <input data-value={bind.object[bind.property]} bind={bind} name="externalComponent" />
      </div>
    )
  }

}

export default TwoWayBindingsExternalComponent;