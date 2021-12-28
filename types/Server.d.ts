export type NullstackServer = {

  get()

  post()

  put()

  patch()

  delete()

  options()

  head()

  use()

  port: number,

  maximumPayloadSize: string,

  /**
   * Will be passed as the argument to [express cors plugin](https://expressjs.com/en/resources/middleware/cors.html).
   */
  cors: object

};