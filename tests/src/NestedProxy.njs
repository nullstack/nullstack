import Nullstack from 'nullstack'

class ShouldNotProxy {

  something = false

  setSomething(value) {
    this.something = value
  }

}

class NestedProxy extends Nullstack {

  array = [{ object: { object: true } }]

  object = {
    array: [true],
  }

  prepare(context) {
    context.array = [{ object: { object: true } }]
    context.object = {
      array: [true],
    }
  }

  hydrate(context) {
    this.shouldNotProxy = new ShouldNotProxy()
    this.shouldNotProxy.setSomething(true)
    context.shouldNotProxy = new ShouldNotProxy()
    context.shouldNotProxy.setSomething(true)
  }

  render({ array, object, shouldNotProxy }) {
    if (!this.hydrated) return false
    return (
      <div
        data-array={!!this.array._isProxy}
        data-array-zero={!!this.array[0]._isProxy}
        data-array-zero-object={!!this.array[0].object._isProxy}
        data-object={!!this.object._isProxy}
        data-object-array={!!this.object.array._isProxy}
        data-should-not-proxy={!this.shouldNotProxy._isProxy}
        data-context-array={!!array._isProxy}
        data-context-array-zero={!!array[0]._isProxy}
        data-context-array-zero-object={!!array[0].object._isProxy}
        data-context-object={!!object._isProxy}
        data-context-object-array={!!object.array._isProxy}
        data-context-should-not-proxy={!shouldNotProxy._isProxy}
      />
    )
  }

}

export default NestedProxy
