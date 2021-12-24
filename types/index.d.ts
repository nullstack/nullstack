
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

interface Nullstack {
  new(someParam: any): Nullstack
}

// declare module 'nullstack' {
//   export default class Nullstack {
//     constructor()
//     static start?(App: any): NullstackClientContext | NullstackServerContext
//     static use?(Plugin: NullstackPlugin)
//   }

// }