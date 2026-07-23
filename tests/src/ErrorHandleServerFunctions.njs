import Nullstack from 'nullstack'
import AppBusinessException from './AppBusinessException.njs'

class ErrorHandleServerFunctions extends Nullstack {

  static async throwAppBusinessError() {
    throw new AppBusinessException('Aconteceu um erro de regra de negocio', {
      status: 422,
      code: 'BUSINESS_VALIDATION',
    })
  }

  static async throwNormalError() {
    throw new Error('Aconteceu um problema nao esperado')
  }

  static async throwJSONError() {
    // Esse é modificado no retorno devido ao context.onerror
    throw { result:  {code: 'UNKNOWN_ERROR', status: 500, message:'Erro Interno', teste:"2"}, status: 400}
  }

  static async throwDummyJsonError() {
    throw { code: 'UNKNOWN_ERROR', status: 500, message:'Erro Interno' }
  }

  async run() {
    const case1 = await this.throwAppBusinessError()
    console.dir({ res: case1 }, { depth: null })

    const case2 = await this.throwNormalError()
    console.dir({ res: case2 }, { depth: null })

    const case3 = await this.throwJSONError()
    console.dir({ res: case3 }, { depth: null })

    const case4 = await this.throwDummyJsonError()
    console.dir({ res: case4 }, { depth: null })
  }

  render() {
    return (
      <div data-error-handle data-hydrated={this.hydrated}>
        <button data-run onclick={this.run}>run</button>
      </div>
    )
  }

}

export default ErrorHandleServerFunctions
