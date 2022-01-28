import Nullstack from 'nullstack';

class FullStackLifecycle extends Nullstack {

  prepared = false;
  initiated = false;
  launched = false;
  hydrated = false;
  updated = false;

  prepare({ environment }) {
    this.prepared = true;
    this.prepareEnv = environment.client ? 'client' : 'server'
  }

  async initiate({ environment }) {
    this.initiated = this.prepared;
    this.initiateEnv = environment.client ? 'client' : 'server'
  }

  launch({ environment }) {
    this.launched = this.initiated;
    this.launchEnv = environment.client ? 'client' : 'server'
  }

  hydrate() {
    this.hydrated = this.launched;
  }

  update() {
    if (!this.updated) {
      this.updated = this.hydrated;
    }
  }

  async terminate({ params }) {
    params.terminated = this.updated;
  }

  render() {
    return (
      <div class="FullStackLifecycle">
        <div data-prepared={this.prepared} data-prepare-env={this.prepareEnv} />
        <div data-initiated={this.initiated} data-initiate-env={this.initiateEnv} />
        <div data-launched={this.launched} data-launch-env={this.launchEnv} />
        <div data-hydrated={this.hydrated} />
        <div data-updated={this.updated} />
        <a href="/"> Terminate </a>
      </div>
    )
  }

}

export default FullStackLifecycle;