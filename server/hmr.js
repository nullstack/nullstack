/* eslint-disable nullstack/no-undef */
import { existsSync, open } from 'fs'
import path from 'path'
import logger from '../builders/logger'

function waitCompiler(next) {
  open(path.join(__dirname, '.compiling'), (error, exists) => {
    if (!exists) {
      next()
    } else {
      setTimeout(() => {
        waitCompiler(next)
      }, 100)
    }
  })
}

export default function hmr(server) {
  const progress = logger('client', 'development')

  if (module.hot) {
    const customConfig = path.resolve(process.cwd(), 'webpack.config.js')
    const webpackConfigs = existsSync(customConfig)
      ? __non_webpack_require__(customConfig)
      : __non_webpack_require__(path.join(__dirname, '..', 'node_modules', 'nullstack', 'webpack.config.js'))

    function resolve(pkg) {
      if (process.cwd().endsWith('/nullstack/tests') || process.cwd().endsWith('\\nullstack\\tests')) {
        return path.join(__dirname, '..', '..', 'node_modules', pkg)
      }
      return pkg
    }

    const webpack = __non_webpack_require__(resolve(`webpack`))
    const webpackDevMiddleware = __non_webpack_require__(resolve(`webpack-dev-middleware`))
    const disk = process.env.NULLSTACK_ENVIRONMENT_DISK === 'true'
    const trace = process.env.__NULLSTACK_TRACE === 'true'
    const webpackConfig = webpackConfigs[1](null, {
      environment: process.env.__NULLSTACK_CLI_ENVIRONMENT,
      input: process.env.__NULLSTACK_CLI_INPUT,
      disk,
      trace,
    })
    const compiler = webpack(webpackConfig)

    const webpackDevMiddlewareOptions = {
      publicPath: '/',
      writeToDisk: disk,
    }

    server.use(async (_request, _response, next) => {
      waitCompiler(next)
    })

    const instance = webpackDevMiddleware(compiler, webpackDevMiddlewareOptions)

    instance.waitUntilValid(() => {
      progress.stop()
      console.info(
        '\x1b[36m%s\x1b[0m',
        `\n 🚀 Your application is ready at http://${process.env.NULLSTACK_PROJECT_DOMAIN}:${process.env.NULLSTACK_SERVER_PORT || process.env.PORT || 3000}\n`,
      )
    })

    server.use(instance)

    const webpackHotMiddleware = __non_webpack_require__(resolve(`webpack-hot-middleware`))
    const webpackHotMiddlewareOptions = { log: false, path: '/nullstack/hmr', noinfo: true, quiet: true }
    server.use(webpackHotMiddleware(compiler, webpackHotMiddlewareOptions))
  }
}
