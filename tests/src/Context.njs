import Nullstack from 'nullstack'

class Context extends Nullstack {

  frameworkInitial = '';

  static async setContextKey(context) {
    context.framework = 'Nullstack'
  }

  static async getContextKey({ framework }) {
    return framework
  }

  static staticFunction(context) {
    return context === undefined
  }

  static _staticUnderlineFunction(context) {
    return context === undefined
  }

  static async _staticAsyncUnderlineFunction(context) {
    return context === undefined
  }

  static async invokeStaticAsyncUnderlineFunction() {
    return await this._staticAsyncUnderlineFunction()
  }

  async initiate(context) {
    await this.setContextKey()
    context.framework = await this.getContextKey()
    this.setFrameworkInitial()
    this.staticFunctionHasNoContext = await Context.staticFunction()
    this.staticUnderlineFunctionHasNoContext = await Context._staticUnderlineFunction()
    this.staticAsyncUnderlineFunctionHasNoContext = await Context.invokeStaticAsyncUnderlineFunction()
  }

  async hydrate() {
    this.hydratedStaticFunctionHasNoContext = await Context.staticFunction()
    this.hydratedStaticUnderlineFunctionHasNoContext = await Context._staticUnderlineFunction()
    this.hydratedStaticAsyncUnderlineFunctionHasNoContext = await Context.invokeStaticAsyncUnderlineFunction()
  }

  setFrameworkInitial({ framework }) {
    this.frameworkInitial = framework[0]
  }

  render({ framework }) {
    return (
      <div
        data-framework={framework}
        data-framework-initial={this.frameworkInitial}
        data-static-function-has-no-context={this.staticFunctionHasNoContext}
        data-static-underline-function-has-no-context={this.staticUnderlineFunctionHasNoContext}
        data-static-async-underline-function-has-no-context={this.staticAsyncUnderlineFunctionHasNoContext}
        data-hydrated-static-function-has-no-context={this.hydratedStaticFunctionHasNoContext}
        data-hydrated-static-underline-function-has-no-context={this.hydratedStaticUnderlineFunctionHasNoContext}
        data-hydrated-static-async-underline-function-has-no-context={
          this.hydratedStaticAsyncUnderlineFunctionHasNoContext
        }
      />
    )
  }

}

export default Context
