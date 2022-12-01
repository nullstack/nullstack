'use strict'

const BaseServer = require('webpack-dev-server/lib/servers/BaseServer')
const WebSocket = require('ws')

class WebsocketServer extends BaseServer {

  constructor(server) {
    super(server)

    const options = {
      ...this.server.options.webSocketServer.options,
      clientTracking: false,
      port: process.env.NULSTACK_SERVER_SOCKET_PORT_YOU_SHOULD_NOT_CARE_ABOUT,
    }

    this.implementation = new WebSocket.Server(options)

    this.server.server.on('upgrade', (req, sock, head) => {
      if (!this.implementation.shouldHandle(req)) {
        return
      }
      this.implementation.handleUpgrade(req, sock, head, (connection) => {
        this.implementation.emit('connection', connection, req)
      })
    })

    this.implementation.on('error', (err) => {
      this.server.logger.error(err.message)
    })

    const interval = setInterval(() => {
      this.clients.forEach((client) => {
        if (client.isAlive === false) {
          client.terminate()

          return
        }

        client.isAlive = false
        client.ping(() => {})
      })
    }, 1000)

    this.implementation.on('connection', (client) => {
      this.clients.push(client)

      client.isAlive = true

      client.on('message', (data) => {
        if (data === '{"type":"NULLSTACK_SERVER_STARTED"}') {
          this.clients.forEach((c) => {
            c.send('{"type":"NULLSTACK_SERVER_STARTED"}')
          })
        }
      })

      client.on('pong', () => {
        client.isAlive = true
      })

      client.on('close', () => {
        this.clients.splice(this.clients.indexOf(client), 1)
      })
    })

    this.implementation.on('close', () => {
      clearInterval(interval)
    })
  }

}

module.exports = WebsocketServer
