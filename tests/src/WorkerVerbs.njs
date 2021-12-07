import Nullstack from 'nullstack';

class WorkerVerbs extends Nullstack {

  static async getter({ request }) {
    return request.method;
  }

  static async getSomething({ request }) {
    return request.method;
  }

  static async putSomething({ request }) {
    return request.method;
  }

  static async patchSomething({ request }) {
    return request.method;
  }

  static async deleteSomething({ request }) {
    return request.method;
  }

  static async postSomething({ request }) {
    return request.method;
  }

  static async regularSomething({ request }) {
    return request.method;
  }

  async hydrate() {
    this.getter = await this.getter()
    this.get = await this.getSomething()
    this.put = await this.putSomething()
    this.patch = await this.patchSomething()
    this.delete = await this.deleteSomething()
    this.post = await this.postSomething()
    this.regular = await this.regularSomething()
  }

  render() {
    return (
      <div
        data-getter={this.getter}
        data-get={this.get}
        data-put={this.put}
        data-patch={this.patch}
        data-delete={this.delete}
        data-post={this.post}
        data-regular={this.regular}
      />
    )
  }

}

export default WorkerVerbs;