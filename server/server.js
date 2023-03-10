import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import deserialize from '../shared/deserialize'
import prefix from '../shared/prefix'
import context, { generateContext } from './context'
import emulatePrerender from './emulatePrerender'
import environment from './environment'
import exposeServerFunctions from './exposeServerFunctions'
import { generateFile } from './files'
import hmr from './hmr'
import generateManifest from './manifest'
import { prerender } from './prerender'
import printError from './printError'
import registry from './registry'
import reqres from './reqres'
import generateRobots from './robots'
import template from './template'
import { generateServiceWorker } from './worker'

const server = express()

server.port = process.env.NULLSTACK_SERVER_PORT || process.env.PORT || 3000

let contextStarted = false
let serverStarted = false

server.use(async (request, response, next) => {
  if (!contextStarted) {
    typeof context.start === 'function' && (await context.start())
    contextStarted = true
  }
  next()
})

emulatePrerender(server)
exposeServerFunctions(server)

if (module.hot) {
  hmr(server)
}

server.start = function () {
  if (serverStarted) return
  serverStarted = true

  server.use(express.static(path.join(process.cwd(), 'public')))

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

  if (environment.development) {
    server.get(`/client.js.map`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable')
      response.contentType('application/json')
      response.send(generateFile('client.js.map', server))
    })

    server.get(`/:number.client.js.map`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable')
      response.contentType('application/json')
      response.send(generateFile(`${request.params.number}.client.js.map`, server))
    })

    server.get(`/client.css.map`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable')
      response.contentType('application/json')
      response.send(generateFile('client.css.map', server))
    })

    server.get(`/:number.client.css.map`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable')
      response.contentType('application/json')
      response.send(generateFile(`${request.params.number}.client.css.map`, server))
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
    reqres.set(request, response)
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
        reqres.clear()
        response.json({ result })
      } catch (error) {
        printError(error)
        reqres.clear()
        response.status(500).json({})
      }
    } else {
      reqres.clear()
      response.status(404).json({})
    }
  })

  server.get('*', async (request, response, next) => {
    if (request.originalUrl.split('?')[0].indexOf('.') > -1) {
      return next()
    }
    reqres.set(request, response)
    const scope = await prerender(request, response)
    if (!response.headersSent) {
      const status = scope.context.page.status
      const html = template(scope)
      reqres.clear()
      response.status(status).send(html)
    } else {
      reqres.clear()
    }
  })

  server.use((error, _request, response, _next) => {
    printError(error)
    response.status(500).json({})
  })

  if (module.hot) {
    process.env.__NULLSTACK_FIRST_LOAD_COMPLETE = true
  }

  if (!server.less) {
    server.listen(server.port, async () => {
      if (environment.production) {
        console.info(
          '\x1b[36m%s\x1b[0m',
          ` ✅️ Your application is ready at http://${process.env.NULLSTACK_PROJECT_DOMAIN}:${process.env.NULLSTACK_SERVER_PORT}\n`,
        )
      }
    })
  }
}

export default server
