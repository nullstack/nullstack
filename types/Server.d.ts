import type { Server as HttpServer } from 'http'

export interface NullstackServer {
  get(...args)

  post(...args)

  put(...args)

  patch(...args)

  delete(...args)

  options(...args)

  head(...args)

  use(...args)

  port: number

  maximumPayloadSize: string

  /**
   * Opt-in: create a Node `http.Server` wrapping the Express app.
   * Enable only when you need WebSockets/Socket.IO on the same port.
   * Must be set to `true` before accessing `server.http`.
   *
   * @example
   * ```
   * const context = Nullstack.start(Application)
   * context.server.useHttp = true
   * const io = new Server(context.server.http)
   * ```
   */
  useHttp?: boolean

  /**
   * Node HTTP server wrapping the Express app.
   * Available only after `server.useHttp = true`.
   * Attach Socket.IO, `ws`, or other upgrade handlers here before listen.
   */
  readonly http: HttpServer

  /**
   * When true, skip auto-listen (used when the server bundle is required by SPA/SSG builders).
   * Not needed to attach WebSockets — use `server.useHttp` + `server.http` instead.
   */
  less?: boolean
}
