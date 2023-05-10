import { KEY } from 'nullstack/environment'

const environment = { client: false, server: true }

environment.development = __dirname.indexOf('.development') > -1
environment.production = !environment.development

environment.mode = process.env.NULLSTACK_ENVIRONMENT_MODE || 'ssr'

environment.key = KEY

environment.name = process.env.NULLSTACK_ENVIRONMENT_NAME || ''

Object.freeze(environment)

export default environment
