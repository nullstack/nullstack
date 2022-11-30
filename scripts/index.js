#! /usr/bin/env node
/* eslint-disable no-continue */
/* eslint-disable no-console */
const { program } = require('commander')
const dotenv = require('dotenv')
const { existsSync, readdir, unlink } = require('fs')
const fetch = require('node-fetch')
const path = require('path')
const webpack = require('webpack')

const { version } = require('../package.json')
const customConfig = path.resolve(process.cwd(), './webpack.config.js')
const config = existsSync(customConfig) ? require(customConfig) : require('../webpack.config')

function getConfig(options) {
  return config.map((env) => env(null, options))
}

function getCompiler(options) {
  return webpack(getConfig(options))
}

function loadEnv(env) {
  let envPath = '.env'
  if (env) {
    envPath += `.${process.env.NULLSTACK_ENVIRONMENT_NAME}`
  }
  dotenv.config({ path: envPath })
}

function getFreePorts() {
  return new Promise((resolve) => {
    const app1 = require('express')()
    const app2 = require('express')()
    const server1 = app1.listen(0, () => {
      const server2 = app2.listen(0, () => {
        const ports = [server1.address().port, server2.address().port]
        server1.close()
        server2.close()
        resolve(ports)
      })
    })
  })
}

function getPort(port) {
  return port || process.env.NULLSTACK_SERVER_PORT || process.env.PORT || 3000
}

function clearOutput(outputPath) {
  if (!existsSync(outputPath)) return
  readdir(outputPath, (err, files) => {
    if (err) throw err
    for (const file of files) {
      if (file === '.cache') continue
      unlink(path.join(outputPath, file), (errr) => {
        if (errr) throw errr
      })
    }
  })
}

async function start({ input, port, env, mode = 'spa', cold, disk, loader = 'swc' }) {
  const environment = 'development'
  console.log(` 🚀️ Starting your application in ${environment} mode...`)
  loadEnv(env)
  const WebpackDevServer = require('webpack-dev-server')
  const { setLogLevel } = require('webpack/hot/log')
  setLogLevel('none')
  process.env.NULLSTACK_ENVIRONMENT_MODE = mode
  process.env.NULLSTACK_SERVER_PORT = getPort(port)
  const ports = await getFreePorts()
  process.env.NULSTACK_SERVER_PORT_YOU_SHOULD_NOT_CARE_ABOUT = ports[0]
  process.env.NULSTACK_SERVER_SOCKET_PORT_YOU_SHOULD_NOT_CARE_ABOUT = ports[1]
  process.env.NULLSTACK_ENVIRONMENT_HOT = (!cold).toString()
  process.env.NULLSTACK_ENVIRONMENT_DISK = (!!disk).toString()
  if (!process.env.NULLSTACK_PROJECT_DOMAIN) process.env.NULLSTACK_PROJECT_DOMAIN = 'localhost'
  if (!process.env.NULLSTACK_WORKER_PROTOCOL) process.env.NULLSTACK_WORKER_PROTOCOL = 'http'
  const target = `${process.env.NULLSTACK_WORKER_PROTOCOL}://${process.env.NULLSTACK_PROJECT_DOMAIN}:${process.env.NULSTACK_SERVER_PORT_YOU_SHOULD_NOT_CARE_ABOUT}`
  const writeToDisk = disk ? true : (path) => path.includes('server')
  const devServerOptions = {
    hot: 'only',
    open: false,
    host: process.env.NULLSTACK_PROJECT_DOMAIN,
    devMiddleware: {
      index: false,
      stats: 'errors-only',
      writeToDisk,
    },
    client: {
      overlay: { errors: true, warnings: false },
      logging: 'none',
      progress: false,
      reconnect: true,
      webSocketURL: `${process.env.NULLSTACK_WORKER_PROTOCOL.replace('http', 'ws')}://${
        process.env.NULLSTACK_PROJECT_DOMAIN
      }:${process.env.NULLSTACK_SERVER_PORT}/ws`,
    },
    proxy: {
      context: () => true,
      target,
      proxyTimeout: 10 * 60 * 1000,
      timeout: 10 * 60 * 1000,
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }
      middlewares.unshift(async (req, res, next) => {
        if (req.originalUrl.indexOf('.hot-update.') === -1) {
          if (req.originalUrl.startsWith('/nullstack/')) {
            console.log(`  ⚙️ [${req.method}] ${req.originalUrl}`)
          } else {
            console.log(`  🕸️ [${req.method}] ${req.originalUrl}`)
          }
        }
        async function waitForServer() {
          if (req.originalUrl.includes('.')) {
            return next()
          }
          try {
            await fetch(`${target}${req.originalUrl}`)
            next()
          } catch (error) {
            if (error.message.includes('ECONNREFUSED')) {
              setTimeout(waitForServer, 100)
            } else {
              throw error
            }
          }
        }
        waitForServer()
      })
      return middlewares
    },
    webSocketServer: require.resolve('./socket'),
    port: process.env.NULLSTACK_SERVER_PORT,
  }
  const compiler = getCompiler({ environment, input, disk, loader })
  clearOutput(compiler.compilers[0].outputPath)
  const server = new WebpackDevServer(devServerOptions, compiler)
  const portChecker = require('express')().listen(process.env.NULLSTACK_SERVER_PORT, () => {
    portChecker.close()
    server.startCallback(() => {
      console.log(
        '\x1b[36m%s\x1b[0m',
        ` ✅️ Your application is ready at http://${process.env.NULLSTACK_PROJECT_DOMAIN}:${process.env.NULLSTACK_SERVER_PORT}\n`,
      )
    })
  })
}

function build({ input, output, cache, env, mode = 'ssr' }) {
  const environment = 'production'
  const compiler = getCompiler({ environment, input, cache })
  if (env) {
    process.env.NULLSTACK_ENVIRONMENT_NAME = env
  }
  console.log(` 🚀️ Building your application in ${mode} mode...`)
  compiler.run((error, stats) => {
    if (stats.hasErrors()) {
      console.log(stats.toString({ colors: true }))
      process.exit(1)
    }
    if (stats.hasErrors()) process.exit(1)
    require(`../builders/${mode}`)({ output, cache, environment })
  })
}

program
  .command('start')
  .alias('s')
  .description('Start application in development environment')
  .addOption(new program.Option('-m, --mode <mode>', 'Build production bundles').choices(['ssr', 'spa']))
  .option('-p, --port <port>', 'Port number to run the server')
  .option('-i, --input <input>', 'Path to project that will be started')
  .option('-e, --env <name>', 'Name of the environment file that should be loaded')
  .option('-d, --disk', 'Write files to disk')
  .option('-c, --cold', 'Disable hot module replacement')
  .addOption(new program.Option('-l, --loader <loader>', 'Use Babel or SWC loader').choices(['swc', 'babel']))
  .helpOption('-h, --help', 'Learn more about this command')
  .action(start)

program
  .command('build')
  .alias('b')
  .description('Build application for production environment')
  .addOption(new program.Option('-m, --mode <mode>', 'Build production bundles').choices(['ssr', 'spa', 'ssg']))
  .option('-i, --input <input>', 'Path to project that will be built')
  .option('-o, --output <output>', 'Path to build output folder')
  .option('-c, --cache', 'Cache build results in .production folder')
  .option('-e, --env <name>', 'Name of the environment file that should be loaded')
  .helpOption('-h, --help', 'Learn more about this command')
  .action(build)

program
  .name('nullstack')
  .addHelpCommand(false)
  .helpOption('-h, --help', 'Learn more about a specific command')
  .version(version, '-v, --version', 'Nullstack version being used')
  .parse(process.argv)
