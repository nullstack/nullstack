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

if (command === 'build') {
  compiler.run(() => {
    if (params.mode === 'ssg' || params.mode === 'spa') {
      require(`../builders/${params.mode}`)(params.output);
    }
  });
} else {
  compiler.watch({}, () => {});
}