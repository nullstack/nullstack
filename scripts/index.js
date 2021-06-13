#! /usr/bin/env node
const command = process.argv[2];

const webpack = require('webpack');
const config = require('../webpack.config');

const args = process.argv.slice(3);
const params = {};

for (const arg of args) {
  const [key, value] = arg.slice(2).split('=');
  params[key] = value;
}

const environment = command === 'start' ? 'development' : 'production';
const { input } = params;

const compiler = webpack(config.map((env) => env(null, { environment, input })));

let lastTrace = '';
let compilingIndex = 1;

function logCompiling(showCompiling) {
  if(!showCompiling) return;
  console.log(" ⚙️  Compiling changes...");
}

function logTrace(stats, showCompiling) {
  if(stats.hasErrors()) {
    const [file, loader, ...trace]  = stats.toJson('errors-only', {colors: true}).children[0].errors[0].split('\n');
    if(loader.indexOf('/nullstack/loaders') === -1) {
      trace.unshift(loader)
    }
    const currentTrace = trace.join(' ');
    if(lastTrace === currentTrace) return;
    lastTrace = currentTrace;
    logCompiling(showCompiling);
    console.log(` 💥️ There is an error preventing compilation in \x1b[31m${file}\x1b[0m`);
    for(const line of trace) {
      console.log('\x1b[31m%s\x1b[0m', '    ' + line.trim());
    }
    console.log();
    compilingIndex = 0;
  } else {
    compilingIndex++;
    if(compilingIndex % 2 === 0) {
      logCompiling(showCompiling);
      compilingIndex = 0;
    }
    lastTrace = '';
  }
}

if (command === 'build') {
  const mode = params.mode || 'ssr';
  console.log(` 🚀️ Building your application in ${mode} mode...`);
  compiler.run((error, stats) => {
    logTrace(stats, false);
    if(!stats.hasErrors()) {
      if (mode === 'ssg' || mode === 'spa' || mode === 'ssr') {
        require(`../builders/${mode}`)(params.output);
      }
    }
  });
} else {
  console.log(` 🚀️ Starting your application in ${environment} mode...`);
  console.log();
  compiler.watch({}, (error, stats) => {
    logTrace(stats, true);
  });
}