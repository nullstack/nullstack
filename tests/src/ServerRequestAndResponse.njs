import Nullstack from 'nullstack'

class ServerRequestAndResponse extends Nullstack {

  responses = {};

  async hydrate() {
    const responses = {}
    const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT']
    for (const method of methods) {
      const body = method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify({})
      const response = await fetch('/api', { method, body })
      responses[`data-${method.toLowerCase()}`] = response.status === 200
    }
    const response = await fetch('/custom-api-before-start')
    const data = await response.json()
    this.startValue = data.startValue
    this.responses = responses
  }

  render() {
    return <div {...this.responses} data-start-value={this.startValue} />
  }

}

export default ServerRequestAndResponse
