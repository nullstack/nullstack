import Nullstack from 'nullstack'

async function api(method, contentType = 'text/plain') {
  const payload = {
    number: 69,
    date: new Date(),
    string: 'nullstack',
  }
  const response = await fetch(`/data/${method}/param?query=query&truthy=true&falsy=false`, {
    method: method.toUpperCase(),
    ...(method !== 'get' && {
      headers: {
        'Content-Type': contentType,
      },
      body: JSON.stringify(payload),
    }),
  })
  const data = await response.json()
  return data.status
}

async function chainable(type) {
  const response = await fetch(`/chainable-${type}-function`)
  const data = await response.json()
  return data.chainable
}

class ExposedServerFunctions extends Nullstack {

  static async getData({ request, project, param, query, truthy, falsy, number, date, string }) {
    return {
      status:
        param === 'param' &&
        query === 'query' &&
        truthy === true &&
        falsy === false &&
        project.name === 'Nullstack Tests' &&
        (request.originalUrl.includes('/get/') ||
          (number === 69 && date.getFullYear() === new Date().getFullYear() && string === 'nullstack')),
    }
  }

  async hydrate() {
    this.chainableServerFunction = await chainable('server')
    this.chainableRegularFunction = await chainable('regular')
    this.all = await api('get')
    this.get = await api('get')
    this.postTextPayload = await api('post')
    this.postJsonPayload = await api('post', 'application/json')
    this.putTextPayload = await api('put')
    this.putJsonPayload = await api('put', 'application/json')
    this.patchTextPayload = await api('patch')
    this.patchJsonPayload = await api('patch', 'application/json')
    this.deleteTextPayload = await api('delete')
    this.deleteJsonPayload = await api('delete', 'application/json')
  }

  render() {
    return (
      <div
        data-get={this.get}
        data-post={this.postTextPayload}
        data-post-json={this.postJsonPayload}
        data-put={this.putTextPayload}
        data-put-json={this.putJsonPayload}
        data-patch={this.patchTextPayload}
        data-patch-json={this.patchJsonPayload}
        data-delete={this.deleteTextPayload}
        data-delete-json={this.deleteJsonPayload}
        data-all={this.all}
        data-chainable-server-function={this.chainableServerFunction}
        data-chainable-regular-function={this.chainableRegularFunction}
      />
    )
  }

}

export default ExposedServerFunctions
