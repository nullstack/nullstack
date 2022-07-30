#! /usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');

const webpack = require('webpack');
const path = require('path');
const { existsSync } = require('fs');
const customConfig = path.resolve(process.cwd(), './webpack.config.js');
const config = existsSync(customConfig) ? require(customConfig) : require('../webpack.config');
const dotenv = require('dotenv')

function getConfig(options) {
  return config.map((env) => env(null, options))
}

function getCompiler(options) {
  return webpack(getConfig(options))
}

function getServerCompiler(options) {
  return webpack(getConfig(options)[0])
}

function loadEnv(env) {
  let envPath = '.env'
  if (env) {
    envPath += `.${process.env.NULLSTACK_ENVIRONMENT_NAME}`
  }
  dotenv.config({ path: envPath })
}

function getFreePorts() {
  return new Promise((resolve, reject) => {
    const app1 = require('express')();
    const app2 = require('express')();
    const server1 = app1.listen(0, () => {
      const server2 = app2.listen(0, () => {
        const ports = [
          server1.address().port,
          server2.address().port
        ]
        server1.close()
        server2.close()
        resolve(ports)
      });
    });
  })
}

function getPort(port) {
  return port || process.env['NULLSTACK_SERVER_PORT'] || process.env['PORT'] || 3000
}

async function start({ input, port, env, mode = 'spa', hot }) {
  const environment = 'development'
  console.log(` 🚀️ Starting your application in ${environment} mode...`);
  loadEnv(env)
  const WebpackDevServer = require('webpack-dev-server');
  const { setLogLevel: setClientLogLevel } = require('webpack/hot/log')
  setClientLogLevel('none')
  // const { setLogLevel: setServerLogLevel } = require('webpack-dev-server/client/utils/log')
  // setServerLogLevel('none')
  process.env['NULLSTACK_ENVIRONMENT_MODE'] = mode
  process.env['NULLSTACK_SERVER_PORT'] = getPort(port)
  const ports = await getFreePorts()
  process.env['NULSTACK_SERVER_PORT_YOU_SHOULD_NOT_CARE_ABOUT'] = ports[0]
  process.env['NULSTACK_SERVER_SOCKET_PORT_YOU_SHOULD_NOT_CARE_ABOUT'] = ports[1]
  const devServerOptions = {
    hot: !!hot,
    open: false,
    devMiddleware: {
      index: false,
      stats: 'none'
    },
    client: {
      overlay: { errors: true, warnings: false },
      logging: 'none',
      progress: false,
    },
    proxy: {
      context: () => true,
      target: `http://localhost:${process.env['NULSTACK_SERVER_PORT_YOU_SHOULD_NOT_CARE_ABOUT']}`
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      middlewares.unshift((req, res, next) => {
        if (req.originalUrl.indexOf('.hot-update.') === -1) {
          if (req.originalUrl.startsWith('/nullstack/')) {
            console.log(`  ⚙️ [${req.method}] ${req.originalUrl}`)
          } else {
            console.log(`  🕸️ [${req.method}] ${req.originalUrl}`)
          }
        }
        next()
      });
      return middlewares;
    },
    webSocketServer: require.resolve('./socket'),
    port: process.env['NULLSTACK_SERVER_PORT']
  };
  const clientCompiler = getCompiler({ environment, input });
  const server = new WebpackDevServer(devServerOptions, clientCompiler);
  const serverCompiler = getServerCompiler({ environment, input });
  let once = false
  serverCompiler.watch({}, (error, stats) => {
    if (!once) {
      server.startCallback(() => {
        console.log('\x1b[36m%s\x1b[0m', ` ✅️ Your application is ready at http://localhost:${process.env['NULLSTACK_SERVER_PORT']}\n`);
      });
      once = true
    }
    if (stats.hasErrors()) {
      console.log(stats.toString({ colors: true }))
    }
  });
}

function build({ input, output, cache, env, mode = 'ssr' }) {
  const environment = 'production';
  const compiler = getCompiler({ environment, input, cache });
  if (env) {
    process.env['NULLSTACK_ENVIRONMENT_NAME'] = env;
  }
  console.log(` 🚀️ Building your application in ${mode} mode...`);
  compiler.run((error, stats) => {
    if (stats.hasErrors()) {
      console.log(stats.toString({ colors: true }))
      process.exit(1);
    }
    if (stats.hasErrors()) process.exit(1);
    require(`../builders/${mode}`)({ output, cache, environment });
  });
}

program
  .command('start')
  .alias('s')
  .description('Start application in development environment')
  .addOption(new program.Option('-m, --mode <mode>', 'Build production bundles').choices(['ssr', 'spa']))
  .option('-p, --port <port>', 'Port number to run the server')
  .option('-i, --input <input>', 'Path to project that will be started')
  .option('-o, --output <output>', 'Path to build output folder')
  .option('-e, --env <name>', 'Name of the environment file that should be loaded')
  .option('--hot', 'Enable hot module replacement')
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
  .name("nullstack")
  .addHelpCommand(false)
  .helpOption('-h, --help', 'Learn more about a specific command')
  .version(version, '-v, --version', 'Nullstack version being used')
  .parse(process.argv);