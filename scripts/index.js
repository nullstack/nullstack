#! /usr/bin/env node
const { program } = require('commander')
const dotenv = require('dotenv')
const { existsSync } = require('fs')
const path = require('path')
const webpack = require(`webpack`)

const { version } = require('../package.json')
const customConfig = path.resolve(process.cwd(), 'webpack.config.js')
const nullstackConfig = path.resolve(process.cwd(), 'node_modules', 'nullstack', 'webpack.config.js')
const config = existsSync(customConfig) ? require(customConfig) : require(nullstackConfig)

function getConfig(options) {
  return config.map((env) => env(null, options))
}

function getCompiler(options) {
  return webpack(getConfig(options))
}

function loadEnv(env) {
  let envPath = '.env'
  if (env) {
    envPath += `.${env}`
  }
  dotenv.config({ path: envPath })
}

async function start({ port, env, mode = 'spa', cold, disk, loader = 'swc' }) {
  loadEnv(env)
  const environment = 'development'
  process.env.NULLSTACK_ENVIRONMENT_MODE = mode
  process.env.NULLSTACK_ENVIRONMENT_HOT = (!cold).toString()
  process.env.NULLSTACK_ENVIRONMENT_DISK = (!!disk).toString()
  process.env.__NULLSTACK_CLI_ENVIRONMENT = environment
  if (env) {
    process.env.NULLSTACK_ENVIRONMENT_NAME = env
  }
  if (port) {
    process.env.NULLSTACK_SERVER_PORT = port
    process.env.__NULLSTACK_CLI_LOADER = environment
  }
  if (!process.env.NULLSTACK_PROJECT_DOMAIN) process.env.NULLSTACK_PROJECT_DOMAIN = 'localhost'
  if (!process.env.NULLSTACK_WORKER_PROTOCOL) process.env.NULLSTACK_WORKER_PROTOCOL = 'http'
  const settings = config[0](null, { environment, disk, loader })
  let loaded = false
  const compiler = webpack(settings)
  compiler.watch({ aggregateTimeout: 300, hot: true, followSymlinks: true }, (error, stats) => {
    if (error) {
      console.error(error.stack || error)
      if (error.details) {
        console.error(error.details)
      }
    } else if (stats.hasErrors()) {
      console.info(stats.toString({ colors: true, warnings: false, logging: false, assets: false, modules: false }))
    } else if (!loaded) {
      loaded = true
      console.info(
        '\x1b[36m%s\x1b[0m',
        ` ✅️ Your application is ready at http://${process.env.NULLSTACK_PROJECT_DOMAIN}:${
          process.env.NULLSTACK_SERVER_PORT || process.env.PORT || 3000
        }\n`,
      )
    }
  })
}

function build({ output, cache, env, mode = 'ssr' }) {
  const environment = 'production'
  const compiler = getCompiler({ environment, cache })
  if (env) {
    process.env.NULLSTACK_ENVIRONMENT_NAME = env
  }
  console.info(` 🚀️ Building your application in ${mode} mode...`)
  compiler.run((error, stats) => {
    if (error) {
      console.error(error.stack || error)
      if (error.details) {
        console.error(error.details)
      }
    } else if (stats.hasErrors()) {
      console.info(stats.toString({ colors: true }))
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
