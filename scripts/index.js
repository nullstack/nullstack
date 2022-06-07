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

function getClientCompiler(options) {
  return webpack(getConfig(options)[1])
}

async function start({ input, port, env, mode = 'ssr', hot }) {
  const environment = 'development';
  const serverCompiler = getServerCompiler({ environment, input });
  let clientStarted = false
  let envPath = '.env'
  if (env) {
    envPath += `.${process.env.NULLSTACK_ENVIRONMENT_NAME}`
  }
  dotenv.config({ path: envPath })
  if (!port) {
    port = process.env['NULLSTACK_SERVER_PORT'] || process.env['PORT'] || 3000
  }
  process.env['NULLSTACK_ENVIRONMENT_MODE'] = mode
  console.log(` 🚀️ Starting your application in ${environment} mode...`);
  const WebpackDevServer = require('webpack-dev-server');
  const { setLogLevel } = require('webpack/hot/log')
  setLogLevel('none')
  serverCompiler.watch({}, (error, stats) => {
    if (stats.hasErrors()) {
      console.log(`\n 💥️ There is an error preventing compilation`);
    } else {
      console.log('\x1b[36m%s\x1b[0m', `\n ✅️ Your application is ready at http://localhost:${port}\n`);
    }
    const bundlePath = path.resolve(process.cwd(), '.development/server.js')
    delete require.cache[require.resolve(bundlePath)]
    if (!clientStarted) {
      clientStarted = true
      const devServerOptions = {
        hot: !!hot,
        open: false,
        devMiddleware: {
          index: false
        },
        client: {
          overlay: true,
          logging: 'none',
          progress: false,
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
            const serverBundle = require(bundlePath)
            const server = serverBundle.default.server
            server.less = true
            server.port = port
            server.start()
            server(req, res, next)
          });
          return middlewares;
        },
        port
      };
      const clientCompiler = getClientCompiler({ environment, input });
      const server = new WebpackDevServer(devServerOptions, clientCompiler);
      server.start();
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