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

declare module 'nullstack' {
  export default class Nullstack {
    static start?(App: any): NullstackClientContext | NullstackServerContext
    static use?(Plugin: NullstackPlugin)
  }

}