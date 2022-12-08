import bodyParser from 'body-parser'
import express from 'express'
import { writeFileSync } from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import WebSocket from 'ws'

import deserialize from '../shared/deserialize'
import extractParamValue from '../shared/extractParamValue'
import prefix from '../shared/prefix'
import context, { generateContext } from './context'
import environment from './environment'
import { generateFile } from './files'
import generateManifest from './manifest'
import { prerender } from './prerender'
import printError from './printError'
import registry from './registry'
import reqres from './reqres'
import generateRobots from './robots'
import template from './template'
import { generateServiceWorker } from './worker'

if (!global.fetch) {
  global.fetch = fetch
}

const server = express()

server.port =
  process.env.NULSTACK_SERVER_PORT_YOU_SHOULD_NOT_CARE_ABOUT ||
  process.env.NULLSTACK_SERVER_PORT ||
  process.env.PORT ||
  3000

let contextStarted = false
let serverStarted = false

for (const method of ['get', 'post', 'put', 'patch', 'delete', 'all']) {
  const original = server[method].bind(server)
  server[method] = function (...args) {
    if (typeof args[1] === 'function' && args[1].name === '_invoke') {
      return original(args[0], bodyParser.text({ limit: server.maximumPayloadSize }), async (request, response) => {
        const params = {}
        for (const key of Object.keys(request.params)) {
          params[key] = extractParamValue(request.params[key])
        }
        for (const key of Object.keys(request.query)) {
          params[key] = extractParamValue(request.query[key])
        }
        if (request.method !== 'GET') {
          Object.assign(params, deserialize(request.body))
        }
        try {
          const subcontext = generateContext({ request, response, ...params })
          const result = await args[1](subcontext)
          response.json(result)
        } catch (error) {
          printError(error)
          response.status(500).json({})
        }
      })
    }
    return original(...args)
  }
}

server.use(async (request, response, next) => {
  if (!contextStarted) {
    typeof context.start === 'function' && (await context.start())
    contextStarted = true
  }
  next()
})

function createRequest(url) {
  return {
    method: 'GET',
    host: '',
    cookies: {},
    query: {},
    url,
    headers: {},
  }
}

function createResponse(callback) {
  const res = {
    _removedHeader: {},
    _statusCode: 200,
    statusMessage: 'OK',
    get statusCode() {
      return this._statusCode
    },
    set statusCode(status) {
      this._statusCode = status
      this.status(status)
    },
  }
  const headers = {}
  let code = 200
  res.set = res.header = (x, y) => {
    if (arguments.length === 2) {
      res.setHeader(x, y)
    } else {
      for (const key in x) {
        res.setHeader(key, x[key])
      }
    }
    return res
  }
  res.setHeader = (x, y) => {
    headers[x] = y
    headers[x.toLowerCase()] = y
    return res
  }
  res.getHeader = (x) => headers[x]
  res.redirect = function (_code, url) {
    if (typeof _code !== 'number') {
      code = 301
      url = _code
    } else {
      code = _code
    }
    res.setHeader('Location', url)
    res.end()
  }
  res.status = res.sendStatus = function (number) {
    code = number
    return res
  }
  res.end =
    res.send =
    res.write =
      function (data = '') {
        if (callback) callback(code, data, headers)
      }
  return res
}

server.prerender = async function (originalUrl) {
  server.start()
  return new Promise((resolve) => {
    server._router.handle(
      createRequest(originalUrl),
      createResponse((code, data) => resolve(data)),
      () => {},
    )
  })
}

server.start = function () {
  if (serverStarted) return
  serverStarted = true

  server.use(express.static(path.join(__dirname, '..', 'public')))

  server.use(bodyParser.text({ limit: server.maximumPayloadSize }))

  if (environment.production) {
    server.get(`/:number.client.js`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable')
      response.contentType('text/javascript')
      response.send(generateFile(`${request.params.number}.client.js`, server))
    })

    server.get(`/:number.client.css`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable')
      response.contentType('text/css')
      response.send(generateFile(`${request.params.number}.client.css`, server))
    })

    server.get(`/client.css`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable')
      response.contentType('text/css')
      response.send(generateFile('client.css', server))
    })

    server.get(`/client.js`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable')
      response.contentType('text/javascript')
      response.send(generateFile('client.js', server))
    })
  }

  server.get(`/manifest.webmanifest`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable')
    response.contentType('application/manifest+json')
    response.send(generateManifest(server))
  })

  server.get(`/service-worker.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable')
    response.contentType('text/javascript')
    response.send(generateServiceWorker())
  })

  server.get('/robots.txt', (request, response) => {
    response.send(generateRobots())
  })

  server.all(`/${prefix}/:hash/:methodName.json`, async (request, response) => {
    const payload = request.method === 'GET' ? request.query.payload : request.body
    const args = deserialize(payload)
    const { hash, methodName } = request.params
    const [invokerHash, boundHash] = hash.split('-')
    const key = `${invokerHash}.${methodName}`
    const invokerKlass = registry[invokerHash]
    let boundKlass = invokerKlass
    if (boundHash) {
      boundKlass = registry[boundHash]
      if (!(boundKlass.prototype instanceof invokerKlass)) {
        return response.status(401).json({})
      }
    }
    const method = registry[key]
    if (method !== undefined) {
      try {
        const subcontext = generateContext({ request, response, ...args })
        const result = await method.call(boundKlass, subcontext)
        response.json({ result })
      } catch (error) {
        printError(error)
        response.status(500).json({})
      }
    } else {
      response.status(404).json({})
    }
  })

  server.get('*', async (request, response, next) => {
    if (request.originalUrl.split('?')[0].indexOf('.') > -1) {
      return next()
    }
    reqres.request = request
    reqres.response = response
    const scope = await prerender(request, response)
    if (!response.headersSent) {
      const status = scope.context.page.status
      const html = template(scope)
      reqres.request = null
      reqres.response = null
      response.status(status).send(html)
    } else {
      reqres.request = null
      reqres.response = null
    }
  })

  if (!server.less) {
    if (!server.port) {
      console.info('\x1b[31mServer port is not defined!\x1b[0m')
      process.exit()
    }

    server.listen(server.port, async () => {
      if (environment.development) {
        if (process.env.NULLSTACK_ENVIRONMENT_DISK === 'true') {
          const content = await server.prerender('/')
          const target = `${process.cwd()}/.development/index.html`
          writeFileSync(target, content)
        }
        const socket = new WebSocket(`ws://localhost:${process.env.NULLSTACK_SERVER_PORT}/ws`)
        socket.onopen = async function () {
          socket.send('{"type":"NULLSTACK_SERVER_STARTED"}')
        }
      } else {
        console.info(
          '\x1b[36m%s\x1b[0m',
          ` ✅️ Your application is ready at http://${process.env.NULLSTACK_PROJECT_DOMAIN}:${process.env.NULLSTACK_SERVER_PORT}\n`,
        )
      }
    })
  }
}

export default server
