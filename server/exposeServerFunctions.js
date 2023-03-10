import extractParamValue from '../shared/extractParamValue'
import fs from 'fs'
import bodyParser from 'body-parser'
import path from 'path'
import deserialize from '../shared/deserialize'
import { generateContext } from './context'
import printError from './printError'
import registry from './registry'
import reqres from './reqres'

export default function exposeServerFunctions(server) {
  for (const method of ['get', 'post', 'put', 'patch', 'delete', 'all']) {
    const original = server[method].bind(server)
    server[method] = function (...args) {
      if (typeof args[1] === 'function' && args[1].name === '_invoke') {
        return original(args[0], bodyParser.text({ limit: server.maximumPayloadSize }), async (request, response) => {
          reqres.set(request, response)
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
            const exposedFunction = module.hot ? registry[args[1].hash] : args[1]
            const result = await exposedFunction(subcontext)
            reqres.clear()
            response.json(result)
          } catch (error) {
            printError(error)
            reqres.clear()
            response.status(500).json({})
          }
        })
      }
      if (module.hot) {
        server._router.stack.forEach((r) => {
          if (r?.route?.path === args[0]) {
            const exists = r.route.stack.find((l) => l.method === method)
            if (!!exists && !!process.env.__NULLSTACK_FIRST_LOAD_COMPLETE) {
              const filename = path.join(process.cwd(), 'server.js')
              const time = new Date()
              fs.utimesSync(filename, time, time)
            }
          }
        })
      }
      return original(...args)
    }
  }
}