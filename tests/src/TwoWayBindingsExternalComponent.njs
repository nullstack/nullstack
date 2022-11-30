import Nullstack from 'nullstack'

class TwoWayBindingsExternalComponent extends Nullstack {

  render({ bind, onchange }) {
    return (
      <div>
        <input
          data-value={bind.object[bind.property]}
          bind={bind}
          onchange={onchange}
          data-onchange={onchange?.name}
          name="externalComponent"
        />
      </div>
    )
  }

}

export default TwoWayBindingsExternalComponent
