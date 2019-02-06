const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: '../../../src/index.js',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'client.js'
  },
  stats: 'errors-only',
  mode: 'production',
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
            { search: 'NULLSTACK_ENVIRONMENT', replace: 'client-framework', flags: 'ig' },
            { search: 'NULLSTACK_ROOT', replace: '../', flags: 'ig' },
            { search: 'NULLSTACK_FOLDER', replace: 'dist', flags: 'ig' }
          ]
        }
      },
      {
        test: /.js$/,
        loader: path.resolve('../../nullstack/client-loader.js'),
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
  target: 'web',
  plugins: [
    new MiniCssExtractPlugin({
      filename: "client.css"
    })
  ],
}
