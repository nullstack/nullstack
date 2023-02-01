import Nullstack from 'nullstack'

class ReqRes extends Nullstack {

  static async innerNestedServerFunctionFromClient(context) {
    return context.request.originalUrl
  }

  static async nestedServerFunctionFromClient() {
    return this.innerNestedServerFunctionFromClient()
  }

  static async serverFunctionFromClient(context) {
    return context.request.originalUrl
  }

  static async innerNestedServerFunction(context) {
    return context.request.originalUrl
  }

  static async serverFunction(context) {
    return context.request.originalUrl
  }

  static async nestedServerFunction() {
    return this.innerNestedServerFunction()
  }

  static async innerNestedExposedServerFunction(context) {
    return context.request.originalUrl
  }

  static async nestedExposedServerFunction() {
    return this.innerNestedExposedServerFunction()
  }

  static async exposedServerFunction(context) {
    return context.request.originalUrl
  }

  async initiate() {
    this.serverFunctionUrl = await ReqRes.serverFunction()
    this.nestedServerFunctionUrl = await ReqRes.nestedServerFunction()
  }

  async fetchServerFunction({ slug }) {
    const response = await fetch(`/${slug}.json`)
    return response.json()
  }

  async hydrate() {
    this.serverFunctionFromClientUrl = await ReqRes.serverFunctionFromClient()
    this.nestedServerFunctionFromClientUrl = await ReqRes.nestedServerFunctionFromClient()
    this.exposedServerFunctionUrl = await this.fetchServerFunction({ slug: 'exposed-server-function-url' })
    this.nestedExposedServerFunctionUrl = await this.fetchServerFunction({ slug: 'nested-exposed-server-function-url' })
  }

  render() {
    return (
      <div
        data-server-function={this.serverFunctionUrl === '/reqres'}
        data-nested-server-function={this.nestedServerFunctionUrl === '/reqres'}
        data-server-function-from-client={this.serverFunctionFromClientUrl?.endsWith?.(
          '/serverFunctionFromClient.json',
        )}
        data-nested-server-function-from-client={this.nestedServerFunctionFromClientUrl?.endsWith?.(
          '/nestedServerFunctionFromClient.json',
        )}
        data-exposed-server-function={this.exposedServerFunctionUrl === '/exposed-server-function-url.json'}
        data-exposed-nested-server-function={
          this.nestedExposedServerFunctionUrl === '/nested-exposed-server-function-url.json'
        }
        data-hydrated={this.hydrated}
      />
    )
  }

}

export default ReqRes
