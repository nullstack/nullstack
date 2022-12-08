import Nullstack from 'nullstack'

async function api(method) {
  const body = {
    number: 69,
    date: new Date(),
    string: 'nullstack',
  }
  const response = await fetch(`/data/${method}/param?query=query&truthy=true&falsy=false`, {
    method: method.toUpperCase(),
    body: method === 'get' ? undefined : JSON.stringify(body),
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
    this.post = await api('post')
    this.put = await api('put')
    this.patch = await api('patch')
    this.delete = await api('delete')
  }

  render() {
    return (
      <div
        data-get={this.get}
        data-post={this.post}
        data-put={this.put}
        data-patch={this.patch}
        data-delete={this.delete}
        data-all={this.all}
        data-chainable-server-function={this.chainableServerFunction}
        data-chainable-regular-function={this.chainableRegularFunction}
      />
    )
  }

}

export default ExposedServerFunctions
