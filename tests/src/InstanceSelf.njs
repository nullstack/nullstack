import Nullstack from 'nullstack';

class InstanceSelf extends Nullstack {

  optimize = false;
  
  render({self}) {
    return (
      <div class="InstanceSelf">
        <div data-initiated={self.initiated} />
        <div data-hydrated={self.hydrated} />
        <div data-prerendered={self.prerendered} />
        {self.hydrated &&
          <div data-class-name={self.element.className} />
        }
      </div>
    )
  }

}

export default InstanceSelf;