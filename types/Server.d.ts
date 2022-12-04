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
}
