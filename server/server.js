import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import deserialize from '../shared/deserialize'
import prefix from '../shared/prefix'
import context, { getCurrentContext, generateCurrentContext } from './context'
import emulatePrerender from './emulatePrerender'
import environment from './environment'
import exposeServerFunctions from './exposeServerFunctions'
import { generateFile } from './files'
import hmr from './hmr'
import generateManifest from './manifest'
import { prerender } from './prerender'
import printError from './printError'
import registry from './registry'
import generateRobots from './robots'
import template from './template'
import { generateServiceWorker } from './worker'
import { load } from './lazy'
import addDevRoutes from './devRoutes'

const server = express()

server.port = process.env.NULLSTACK_SERVER_PORT || process.env.PORT || 3000

let contextStarted = false
let serverStarted = false

server.use(async (request, response, next) => {
  if (!contextStarted) {
    typeof context.start === 'function' && (await context.start())
    contextStarted = true
  }
  generateCurrentContext({request, response}, () => {
    next()
  })
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

    addDevRoutes(server)
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
    await load(boundHash || invokerHash)
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
        const currentContext = getCurrentContext(args)
        const result = await method.call(boundKlass, currentContext)
        response.json({ result })
      } catch (error) {
        printError(error)
        response.status(500).json({})
      }
    } else {
      response.status(404).json({})
    }
  })

  if (module.hot) {
    server.all(`/${prefix}/:version/:hash/:methodName.json`, async (request, response) => {
      const payload = request.method === 'GET' ? request.query.payload : request.body
      const args = deserialize(payload)
      const { version, hash, methodName } = request.params
      const [invokerHash, boundHash] = hash.split('-')
      let [filePath, klassName] = (invokerHash || boundHash).split("___")
      const file = path.resolve('..', filePath.replaceAll('__', '/'))
      console.info('\x1b[1;37m%s\x1b[0m', ` [${request.method}] ${request.path}`)
      console.info('\x1b[2;37m%s\x1b[0m', `  - ${file}`)
      console.info('\x1b[2;37m%s\x1b[0m', `  - ${klassName}.${methodName}(${JSON.stringify(args)})\n`)
      const key = `${invokerHash}.${methodName}`
      let invokerKlass;
      await load(boundHash || invokerHash)
      async function reply() {
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
            const currentContext = getCurrentContext(args)
            const result = await method.call(boundKlass, currentContext)
            response.json({ result })
          } catch (error) {
            printError(error)
            response.status(500).json({})
          }
        } else {
          response.status(404).json({})
        }
      }
      async function delay() {
        invokerKlass = registry[invokerHash]
        if (invokerKlass && invokerKlass.__hashes[methodName] !== version) {
          setTimeout(() => {
            delay()
          }, 0)
        } else {
          reply()
        }
      }
      delay()
    })
  }

  server.get('*', async (request, response, next) => {
    if (request.originalUrl.split('?')[0].indexOf('.') > -1) {
      return next()
    }
    const scope = await prerender(request, response)
    if (!response.headersSent) {
      const status = scope.context.page.status
      const html = template(scope)
      response.status(status).send(html)
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
