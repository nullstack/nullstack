import Nullstack from 'nullstack';
import StatefulComponent from './StatefulComponent';

class InstanceSelf extends Nullstack {

  optimize = false;

  hydrate({self}) {
    this.className = self.element.className;
  }
  
  render({self}) {
    return (
      <div class="InstanceSelf">
        <div data-initiated={self.initiated} />
        <div data-hydrated={self.hydrated} />
        <div data-prerendered={self.prerendered} />
        <div data-key={self.key} />
        {self.hydrated &&
          <>
            <div data-class-name={self.element.className} />
            <div data-hydrated-class-name={this.className} />
            <StatefulComponent />
          </>
        }
      </div>
    )
  }

}

export default InstanceSelf;