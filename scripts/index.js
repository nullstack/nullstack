#! /usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');

let lastTrace = '';
let compilingIndex = 1;
const buildModes = ['ssg', 'spa', 'ssr'];

const webpack = require('webpack');
const config = require('../webpack.config');

const getCompiler = ({ environment, input }) => webpack(config.map((env) => env(null, { environment, input })));

const logCompiling = showCompiling => showCompiling && console.log(" ⚙️  Compiling changes...");

function logTrace(stats, showCompiling) {
  if (stats.hasErrors()) {
    const [file, loader, ...trace] = stats.toJson('errors-only', { colors: true }).children[0].errors[0].split('\n');
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

function start({ input, port }) {
  const environment = 'development';
  const compiler = getCompiler({ environment, input });

  process.env['NULLSTACK_SERVER_PORT'] = port;
  console.log(` 🚀️ Starting your application in ${environment} mode...`);
  console.log();
  compiler.watch({}, (error, stats) => logTrace(stats, true));
}

function build({ input, mode, output }) {
  const environment = 'production';
  const compiler = getCompiler({ environment, input });

  console.log(` 🚀️ Building your application in ${mode} mode...`);
  compiler.run((error, stats) => {
    logTrace(stats, false);
    if (stats.hasErrors()) return;
    buildModes.includes(mode) && require(`../builders/${mode}`)(output);
  });
}

program.command('start')
  .alias('s')
  .description('Start application')
  .option('-p, --port <port>', 'Port to start application', 5000)
  .option('-i, --input <input>', 'Project folder to start')
  .action(start)
program
  .command('build')
  .alias('b')
  .description('Build application')
  .option('-m, --mode <mode>', 'Build', 'ssr')
  .option('-i, --input <input>', 'Project folder to build')
  .option('-o, --output <output>', 'Build to folder')
  .action(build)

program.version(version).parse(process.argv);
