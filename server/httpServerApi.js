const { createServer } = require('http')

/**
 * Opt-in Node http.Server API for Express apps (Socket.IO / ws on the same port).
 * @param {import('express').Express} server
 */
function enableHttpServerApi(server) {
  let useHttp = false
  let httpServer = null

  Object.defineProperty(server, 'useHttp', {
    configurable: true,
    enumerable: true,
    get() {
      return useHttp
    },
    set(value) {
      useHttp = !!value
      if (useHttp && !httpServer) {
        httpServer = createServer(server)
      }
    },
  })

  Object.defineProperty(server, 'http', {
    configurable: true,
    enumerable: true,
    get() {
      if (!httpServer) {
        throw new Error(
          'Nullstack: set server.useHttp = true before accessing server.http (required for WebSockets/Socket.IO)',
        )
      }
      return httpServer
    },
  })

  return server
}

/**
 * Target used by Nullstack auto-listen.
 * @param {import('express').Express} server
 */
function getListenTarget(server) {
  return server.useHttp ? server.http : server
}

module.exports = { enableHttpServerApi, getListenTarget }
