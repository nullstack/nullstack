#! /usr/bin/env node

process.env.NODE_ENV='production'
console.log(__dirname)

const webpack = require('webpack');
const config = require('../webpack.config')

const argv = {
  dir: '../decouple-front-end',
  mode: 'production'
}

console.log(config.map((env) => env({}, argv)))

webpack(config.map((env) => env({}, argv)), (a , b) => console.log(b.toJson().errors)) //.run((err, res) => console.log(err, res));