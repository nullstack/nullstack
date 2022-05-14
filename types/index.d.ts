import { NullstackClientContext } from './ClientContext'
import { NullstackPlugin } from './Plugin'
import { NullstackServerContext } from './ServerContext'

export interface NullstackContext extends NullstackClientContext, NullstackServerContext {}
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
export { N } from './JSX'

import { ComponentLifecycle } from './JSX'

export default class Nullstack<Props = {}> implements ComponentLifecycle {
  constructor(props?: Props)
  /**
   * @param App A Nullstack app root component
   */
  static start?(App: any): NullstackContext
  /**
   * Use a plugin
   */
  static use?(Plugin: NullstackPlugin): void
  prepare?(context: NullstackContext & Props): any
  initiate?(context: NullstackContext & Props): any
  launch?(context: NullstackContext & Props): any
  hydrate?(context: NullstackClientContext & Props): any
  update?(context: NullstackContext & Props): any
  terminate?(context: NullstackContext & Props): any
  render?(context: NullstackContext & Props): any
}