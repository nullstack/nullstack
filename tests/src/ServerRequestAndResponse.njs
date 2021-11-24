import Nullstack from 'nullstack';

class ServerRequestAndResponse extends Nullstack {

  responses = {};

  static async start({ server }) {
    server.cors = {
      origin: 'http://localhost:6969',
      optionsSuccessStatus: 200
    }
  }

  async hydrate() {
    const responses = {};
    const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];
    for (const method of methods) {
      const body = method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify({});
      const response = await fetch('/api', { method, body });
      responses[`data-${method.toLowerCase()}`] = response.status === 200;
    }
    this.responses = responses;
  }

  render() {
    return (
      <div {...this.responses} />
    )
  }

}

export default ServerRequestAndResponse;