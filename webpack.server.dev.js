const path = require('path');
const webpack = require('webpack');
const NodemonPlugin = require('nodemon-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: '../../../src/index.js',
  output: {
    path: path.resolve(__dirname, '../../build'),
    filename: 'server.js'
  },
  devtool: 'inline-source-map',
  stats: 'errors-only',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              ["@babel/preset-env", {"targets": { node: "10" }}],
              "@babel/preset-react"
            ],
            "plugins": [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              "@babel/plugin-proposal-export-default-from",
              "@babel/plugin-proposal-class-properties"
            ]
          }
        }
      },
      {
        test: /.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: 'NULLSTACK_ENVIRONMENT', replace: 'server-framework', flags: 'ig' },
            { search: 'NULLSTACK_ROOT', replace: '../../..', flags: 'ig' },
            { search: 'NULLSTACK_FOLDER', replace: 'build', flags: 'ig' }
          ]
        }
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader'},
          { loader: 'sass-loader'}
        ],
      },
    ]
  },
  target: 'node',
  plugins: [
    new NodemonPlugin({
      script: '../../../build/server.js',
    }),
    new MiniCssExtractPlugin({
      filename: "client.css"
    })
  ]
}
