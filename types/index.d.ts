import { NullstackClientContext } from './ClientContext'
import { NullstackPlugin } from './Plugin'
import { NullstackServerContext } from './ServerContext'

export * from './ClientContext'
export * from './Environment'
export * from './Page'
export * from './Params'
export * from './Plugin'
export * from './Project'
export * from './Router'
export * from './Secrets'
export * from './Self'
export * from './Server'
export * from './ServerContext'
export * from './Settings'
export * from './Worker'

import N from './JSX'
export { N }

export default class Nullstack<Type = any> {
  constructor(props?: Type)
  static start?(App: any): NullstackClientContext | NullstackServerContext
  static use?(Plugin: NullstackPlugin)
}