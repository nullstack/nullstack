import Nullstack from 'nullstack';

class RemoveStart extends Nullstack {

  startRemovedFromClient = false;
  startupNotRemovedFromClient = false;

  static async startFollowedByUppercase() {
    return true;
  }

  static async startupFunction() {
    return true;
  }

  async hydrate() {
    this.startRemovedFromClient = !RemoveStart.startFollowedByUppercase;
    this.startupNotRemovedFromClient = await this.startupFunction();
  }

  render() {
    return (
      <main>
        <div data-start-removed-from-client={this.startRemovedFromClient} />
        <div data-startup-not-removed-from-client={this.startupNotRemovedFromClient} />
      </main>
    )
  }

}

export default RemoveStart;