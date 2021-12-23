/// <reference path="./Context/index.d.ts"/>
/// <reference path="./Plugin.d.ts"/>

interface indexContext extends Context {
  start()
}

declare module 'nullstack' {
  export default class Nullstack {
    static start?(App: any): indexContext
    static use?(Plugin: ElementPlugin): undefined
  }
}

declare module '*.njs' {
  export default class {}
}