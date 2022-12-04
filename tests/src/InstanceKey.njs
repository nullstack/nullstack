import Nullstack from 'nullstack'

import StatefulComponent from './StatefulComponent'

class InstanceKey extends Nullstack {

  count = 1;

  render() {
    return (
      <div>
        {this.count % 2 === 0 && <StatefulComponent key="KEY" />}
        {this.count % 2 !== 0 && <StatefulComponent key="KEY" />}
        <StatefulComponent key="KEY" />
        <button class="move-component" onclick={{ count: this.count + 1 }}>
          {' '}
          +{' '}
        </button>
      </div>
    )
  }

}

export default InstanceKey
