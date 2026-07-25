/**
 * @jest-environment node
 */
const express = require('express')
const http = require('http')
const { enableHttpServerApi, getListenTarget } = require('../../server/httpServerApi')

function createApp() {
  const app = express()
  enableHttpServerApi(app)
  return app
}

describe('server.useHttp / server.http', () => {
  test('useHttp defaults to false', () => {
    const app = createApp()
    expect(app.useHttp).toBe(false)
  })

  test('accessing http without useHttp throws', () => {
    const app = createApp()
    expect(() => app.http).toThrow(/set server\.useHttp = true/)
  })

  test('useHttp = true creates a Node http.Server wrapping Express', () => {
    const app = createApp()
    app.useHttp = true
    expect(app.useHttp).toBe(true)
    expect(app.http).toBeInstanceOf(http.Server)
  })

  test('useHttp coerces truthy values', () => {
    const app = createApp()
    app.useHttp = 1
    expect(app.useHttp).toBe(true)
    expect(app.http).toBeInstanceOf(http.Server)
  })

  test('http instance is stable across accesses', () => {
    const app = createApp()
    app.useHttp = true
    expect(app.http).toBe(app.http)
  })

  test('setting useHttp true again keeps the same http server', () => {
    const app = createApp()
    app.useHttp = true
    const first = app.http
    app.useHttp = true
    expect(app.http).toBe(first)
  })

  test('getListenTarget returns Express when useHttp is false', () => {
    const app = createApp()
    expect(getListenTarget(app)).toBe(app)
  })

  test('getListenTarget returns http.Server when useHttp is true', () => {
    const app = createApp()
    app.useHttp = true
    expect(getListenTarget(app)).toBe(app.http)
  })

  test('http.Server serves Express routes on the same port', (done) => {
    const app = createApp()
    app.useHttp = true
    app.get('/ping', (_request, response) => {
      response.send('pong')
    })

    app.http.listen(0, async () => {
      try {
        const { port } = app.http.address()
        const response = await fetch(`http://127.0.0.1:${port}/ping`)
        const body = await response.text()
        expect(response.status).toBe(200)
        expect(body).toBe('pong')
        app.http.close(done)
      } catch (error) {
        app.http.close(() => done(error))
      }
    })
  })

  test('upgrade listeners can attach to server.http', (done) => {
    const app = createApp()
    app.useHttp = true

    let upgraded = false
    app.http.on('upgrade', (request, socket) => {
      upgraded = request.url === '/socket-test'
      socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
          'Upgrade: websocket\r\n' +
          'Connection: Upgrade\r\n' +
          '\r\n',
      )
      socket.end()
    })

    app.http.listen(0, () => {
      const { port } = app.http.address()
      const client = http.request({
        host: '127.0.0.1',
        port,
        path: '/socket-test',
        headers: {
          Connection: 'Upgrade',
          Upgrade: 'websocket',
          'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
          'Sec-WebSocket-Version': '13',
        },
      })

      client.on('upgrade', (_response, socket) => {
        expect(upgraded).toBe(true)
        socket.destroy()
        app.http.close(done)
      })

      client.on('error', (error) => {
        app.http.close(() => done(error))
      })

      client.end()
    })
  })
})
