export type NullstackServer = {
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
   * Will be passed as the argument to [express cors plugin](https://expressjs.com/en/resources/middleware/cors.html).
   */
  cors: object
}
