import Nullstack from 'nullstack';

class NestedProxy extends Nullstack {

  array = [
    {object: {object: true}}
  ]

  object = {
    array: [true]
  }

  hydrate() {
    console.log(this);
  }

  prepare(context) {
    context.array = [
      {object: {object: true}}
    ]
    context.object = {
      array: [true]
    }
  }
  
  render(context) {
    if(!context.self.hydrated) return false
    return (
      <div 
        data-array={!!this.array._isProxy}
        data-array-zero={!!this.array[0]._isProxy} 
        data-array-zero-object={!!this.array[0].object._isProxy} 
        data-object={!!this.object._isProxy}
        data-object-array={!!this.object.array._isProxy}

        data-context-array={!!context.array._isProxy}
        data-context-array-zero={!!context.array[0]._isProxy} 
        data-context-array-zero-object={!!context.array[0].object._isProxy} 
        data-context-object={!!context.object._isProxy}
        data-context-object-array={!!context.object.array._isProxy}
      />
    )
  }

}

export default NestedProxy;