const path = require('path');
const glob = require('glob');
const NodemonPlugin = require('nodemon-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const crypto = require("crypto");
const { readdirSync } = require('fs');

const buildKey = crypto.randomBytes(20).toString('hex');

const babel = {
  test: /\.js$/,
  resolve: {
    extensions: ['.njs', '.js']
  },
  use: {
    loader: 'babel-loader',
    options: {
      "presets": [
        ["@babel/preset-env", { "targets": { node: "10" } }]
      ],
      "plugins": [
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-class-properties"
      ]
    }
  }
};

const babelNullstack = {
  test: /\.njs$/,
  resolve: {
    extensions: ['.njs', '.js']
  },
  use: {
    loader: 'babel-loader',
    options: {
      "presets": [
        ["@babel/preset-env", { "targets": { node: "10" } }],
        "@babel/preset-react"
      ],
      "plugins": [
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-transform-react-jsx", {
          "pragma": "Nullstack.element",
          "pragmaFrag": "Nullstack.fragment",
          "throwIfNamespace": false
        }]
      ]
    }
  }
};

function server(env, argv) {
  const dir = argv.input || '../..';
  const icons = {};
  const publicFiles = readdirSync(path.join(__dirname, dir, 'public'));
  for (const file of publicFiles) {
    if (file.startsWith('icon-')) {
      const size = file.split('x')[1].split('.')[0];
      icons[size] = '/' + file;
    }
  }
  const folder = argv.environment === 'development' ? '.development' : '.production';
  const devtool = argv.environment === 'development' ? 'cheap-inline-module-source-map' : 'none';
  const minimize = argv.environment !== 'development';
  const plugins = argv.environment === 'development' ? ([
    new NodemonPlugin({
      watch: path.resolve('./.development'),
      script: './.development/server.js',
      nodeArgs: ['--enable-source-maps'],
      quiet: true
    })
  ]) : undefined;
  return {
    mode: argv.environment,
    entry: './server.js',
    output: {
      path: path.resolve(__dirname, dir + '/' + folder + '/'),
      filename: 'server.js',
      libraryTarget: 'umd'
    },
    optimization: {
      minimize: minimize,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            //keep_classnames: true,
            keep_fnames: true
          }
        })
      ]
    },
    devtool,
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /nullstack.js$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: '{{NULLSTACK_ENVIRONMENT_NAME}}', replace: 'server', flags: 'ig' }
            ]
          }
        },
        {
          test: /environment.js$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: '{{NULLSTACK_ENVIRONMENT_KEY}}', replace: buildKey, flags: 'ig' }
            ]
          }
        },
        {
          test: /project.js$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: '{{NULLSTACK_PROJECT_ICONS}}', replace: JSON.stringify(icons), flags: 'ig' }
            ]
          }
        },
        babel,
        babelNullstack,
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/inject-nullstack.js'),
        },
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/register-static-from-server.js'),
        },
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/add-source-to-node.js'),
        },
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/register-inner-components.js'),
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            { loader: 'ignore-loader' }
          ]
        },
      ]
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins
  }
}

function client(env, argv) {
  const dir = argv.input || '../..';
  const folder = argv.environment === 'development' ? '.development' : '.production';
  const devtool = argv.environment === 'development' ? 'cheap-inline-module-source-map' : 'none';
  const minimize = argv.environment !== 'development';
  let liveReload = {};
  if (argv.environment !== 'development') {
    liveReload = {
      test: /liveReload.js$/,
      use: [
        { loader: 'ignore-loader' }
      ]
    }
  }
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "client.css"
    })
  ]
  if (argv.environment === 'production') {
    if (argv.environment === 'production') {
      plugins.push(new PurgecssPlugin({
        paths: glob.sync(`src/**/*`, { nodir: true }),
        content: ['./**/*.njs'],
        whitelist: ['script', 'body', 'html', 'style'],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      }));
    }
  }
  return {
    mode: argv.environment,
    entry: './client.js',
    output: {
      publicPath: `/nullstack/${buildKey}/`,
      path: path.resolve(__dirname, dir + '/' + folder + '/'),
      filename: 'client.js'
    },
    optimization: {
      minimize: minimize,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            //keep_classnames: true,
            keep_fnames: true
          }
        })
      ]
    },
    devtool,
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /nullstack.js$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: '{{NULLSTACK_ENVIRONMENT_NAME}}', replace: 'client', flags: 'ig' }
            ]
          }
        },
        babel,
        babelNullstack,
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/remove-import-from-client.js'),
        },
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/inject-nullstack.js'),
        },
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/remove-static-from-client.js'),
        },
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/add-source-to-node.js'),
        },
        {
          test: /.njs$/,
          loader: path.resolve('./node_modules/nullstack/loaders/register-inner-components.js'),
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ],
        },
        liveReload
      ]
    },
    target: 'web',
    plugins
  }
}

module.exports = [server, client]