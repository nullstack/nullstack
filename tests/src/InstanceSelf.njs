import Nullstack from 'nullstack';
import StatefulComponent from './StatefulComponent';

class InstanceSelf extends Nullstack {

  render() {
    return (
      <div class="InstanceSelf">
        <div data-initiated={this.initiated} />
        <div data-hydrated={this.hydrated} />
        <div data-prerendered={this.prerendered} />
        <div data-key={this.key} />
        {this.hydrated && <StatefulComponent />}
      </div>
    )
  }

}

export default InstanceSelf;