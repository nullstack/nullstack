#! /usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');

let lastTrace = '';
let compilingIndex = 1;

const webpack = require('webpack');
const path = require('path');
const { existsSync } = require('fs');
const customConfig = path.resolve(process.cwd(), './webpack.config.js');
const config = existsSync(customConfig) ? require(customConfig) : require('../webpack.config');
const dotenv = require('dotenv')
const express = require('express')

const buildModes = ['ssg', 'spa', 'ssr']

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

function logCompiling(showCompiling) {
  if (!showCompiling) return;
  console.log(" ⚙️  Compiling changes...");
}

function logTrace(stats, showCompiling) {
  if (stats.hasErrors()) {
    const response = stats.toJson('errors-only', { colors: true })
    const error = response.errors[0] || response.children[0].errors[0];
    const { moduleName: file, message } = error
    const [loader, ...trace] = message.split('\n');
    if (loader.indexOf('/nullstack/loaders') === -1) trace.unshift(loader)
    const currentTrace = trace.join(' ');
    if (lastTrace === currentTrace) return;
    lastTrace = currentTrace;
    logCompiling(showCompiling);
    console.log(` 💥️ There is an error preventing compilation in \x1b[31m${file}\x1b[0m`);
    for (const line of trace) {
      console.log('\x1b[31m%s\x1b[0m', '    ' + line.trim());
    }
    console.log();
    compilingIndex = 0;
    return
  }
  compilingIndex++;
  if (compilingIndex % 2 === 0) {
    logCompiling(showCompiling);
    compilingIndex = 0;
  }
  lastTrace = '';
}

async function findFreePort() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      server.close()
      resolve(port)
    });
  })
}

async function start({ input, port, env, output, mode = 'ssr' }) {
  const environment = 'development';
  const serverCompiler = getServerCompiler({ environment, input });
  let clientStarted = false
  let path = '.env'
  if (env) {
    process.env['NULLSTACK_ENVIRONMENT_NAME'] = env;
    path += `.${process.env.NULLSTACK_ENVIRONMENT_NAME}`
  }
  dotenv.config({ path })
  process.env['NULLSTACK_SERVER_PORT'] = port || process.env['NULLSTACK_SERVER_PORT'] || process.env['PORT'];
  let proxyTarget
  if (process.env['NULLSTACK_SECONDARY_SERVER_PORT']) {
    proxyTarget = `http://[::1]:${process.env['NULLSTACK_SECONDARY_SERVER_PORT']}`
  } if (!process.env['NULLSTACK_WORKER_API']) {
    process.env['NULLSTACK_SECONDARY_SERVER_PORT'] = await findFreePort()
    process.env['NULLSTACK_WORKER_API'] = `http://localhost:${process.env['NULLSTACK_SECONDARY_SERVER_PORT']}`
    proxyTarget = process.env['NULLSTACK_WORKER_API'].replace('//localhost:', '//[::1]:')
  } else {
    if (!process.env['NULLSTACK_SECONDARY_SERVER_PORT']) {
      process.env['NULLSTACK_SECONDARY_SERVER_PORT'] = new URL(process.env['NULLSTACK_WORKER_API']).port
    }
    proxyTarget = `http://[::1]:${process.env['NULLSTACK_SECONDARY_SERVER_PORT']}`
  }
  console.log(` 🚀️ Starting your application in ${environment} mode...`);
  console.log();
  const WebpackDevServer = require('webpack-dev-server');
  const { setLogLevel } = require('webpack/hot/log')
  setLogLevel('error')
  serverCompiler.watch({}, (error, stats) => {
    logTrace(stats, true)
    if (!stats.hasErrors() && mode !== 'ssr') {
      require(`../builders/${mode}`)({ output, environment });
    };
    if (!clientStarted) {
      clientStarted = true
      const devServerOptions = {
        hot: true,
        open: false,
        proxy: {
          context: () => true,
          target: proxyTarget
        },
        client: {
          logging: 'error',
          progress: true,
        },
        port: process.env['NULLSTACK_SERVER_PORT']
      };
      const clientCompiler = getClientCompiler({ environment, input });
      const server = new WebpackDevServer(devServerOptions, clientCompiler);
      server.startCallback(() => {
        console.log('\x1b[36m%s\x1b[0m', ` ✅️ Your application is ready at http://localhost:${process.env['NULLSTACK_SERVER_PORT']}\n`);
      });
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
    logTrace(stats, false);
    if (stats.hasErrors()) process.exit(1);
    require(`../builders/${mode}`)({ output, cache, environment });
  });
}

program
  .command('start')
  .alias('s')
  .description('Start application in development environment')
  .addOption(new program.Option('-m, --mode <mode>', 'Build production bundles').choices(buildModes))
  .option('-p, --port <port>', 'Port number to run the server')
  .option('-i, --input <input>', 'Path to project that will be started')
  .option('-o, --output <output>', 'Path to build output folder')
  .option('-e, --env <name>', 'Name of the environment file that should be loaded')
  .helpOption('-h, --help', 'Learn more about this command')
  .action(start)

program
  .command('build')
  .alias('b')
  .description('Build application for production environment')
  .addOption(new program.Option('-m, --mode <mode>', 'Build production bundles').choices(buildModes))
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