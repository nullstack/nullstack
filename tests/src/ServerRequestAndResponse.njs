import Nullstack from 'nullstack';

class ServerRequestAndResponse extends Nullstack {

  responses = {};

  static methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];

  static async start({server}) {
    server.use('/api', (request, response, next) => {
      request.status = 200;
      if(!response.headersSent) {
        next();
      }
    });
    for(const method of ServerRequestAndResponse.methods) {
      server[method.toLowerCase()]('/api', (request, response) => {
        response.status(request.status).send(request.method);
      });
    }
    server.port = 6969;
  }

  async hydrate() {
    const responses = {};
    for(const method of ServerRequestAndResponse.methods) {
      const body = method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify({});
      const response = await fetch('/api', {method, body});
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