import Nullstack from 'nullstack'

import cors from 'cors'
import express from 'express'

import Application from './src/Application'
import CatchError from './src/CatchError'
import ContextProject from './src/ContextProject'
import ContextSecrets from './src/ContextSecrets'
import ContextSettings from './src/ContextSettings'
import ContextWorker from './src/ContextWorker'
import ExposedServerFunctions from './src/ExposedServerFunctions'
import setExternalRoute from './src/externalRoute'
import vueable from './src/plugins/vueable'
import ReqRes from './src/ReqRes'
import AppBusinessException from './src/AppBusinessException'
import ErrorHandleServerFunctions from './src/ErrorHandleServerFunctions'

Nullstack.use(vueable)

const context = Nullstack.start(Application)

const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT']

context.server.use(
  cors({
    origin: 'http://localhost:6969',
    optionsSuccessStatus: 200,
  }),
)
context.server.use(express.json())

context.worker.staleWhileRevalidate = [/[0-9]/]
context.worker.cacheFirst = [/[0-9]/]

context.server
  .get('/data/get/:param', ExposedServerFunctions.getData)
  .get('/chainable-server-function', (request, response) => {
    response.json({ chainable: true })
  })
  .get('/chainable-regular-function', (request, response) => {
    response.json({ chainable: true })
  })
context.server.get('/data/all/:param', ExposedServerFunctions.getData)
context.server.post('/data/post/:param', ExposedServerFunctions.getData)
context.server.put('/data/put/:param', ExposedServerFunctions.getData)
context.server.patch('/data/patch/:param', ExposedServerFunctions.getData)
context.server.delete('/data/delete/:param', ExposedServerFunctions.getData)

context.server.get('/exposed-server-function-url.json', ReqRes.exposedServerFunction)
context.server.get('/nested-exposed-server-function-url.json', ReqRes.nestedExposedServerFunction)

context.server.get('/custom-api-before-start', (request, response) => {
  response.json({ startValue: context.startValue })
})

context.server.use('/api', (request, response, next) => {
  request.status = 200
  if (!response.headersSent) {
    next()
  }
})

for (const method of methods) {
  context.server[method.toLowerCase()]('/api', (request, response) => {
    response.status(request.status).json({ method: request.method })
  })
}

context.server.get('/vaidamerdanaapi.json', (_request, response) => {
  response.vaidamerdanaapi()
})

context.server.get(
  '/error-handle/exposed-business.json',
  ErrorHandleServerFunctions.throwAppBusinessError,
)
context.server.get('/error-handle/exposed-normal.json', ErrorHandleServerFunctions.throwNormalError)
context.server.get('/error-handle/exposed-json.json', ErrorHandleServerFunctions.throwJSONError)
context.server.get('/error-handle/exposed-dummy.json', ErrorHandleServerFunctions.throwDummyJsonError)

context.startIncrementalValue = 0

setExternalRoute(context.server)

context.server.use((request, response, next) => {
  context.url = request.originalUrl
  next()
})

context.start = async function () {
  await ContextProject.start(context)
  await ContextSecrets.start(context)
  await ContextSettings.start(context)
  await ContextWorker.start(context)
  context.startValue = true
  context.startIncrementalValue++
}

context.catch = async function (error) {
  CatchError.logError({ message: error.message })
  if (context.environment.development) {
    console.error(error)
  }
}


context.onerror = function (error) {
  //Dentro do result construimos da nossa forma
  //result e status é obrigatorio para o padrao do nullstack
  if(error instanceof AppBusinessException){
    return {
      status: 422,
      result: {
        message: `Business Exception: ${error.message}`,
        code: error.code,
      },
    }
  }
  return {
    status: error.status || 500,
    result: {
      message: error.message,
      code: error.code || 'ERROR_UNKNOWN',
    },
  }
}

export default context
