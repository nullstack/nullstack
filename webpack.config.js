const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const crypto = require("crypto");
const { readdirSync } = require('fs');

const buildKey = crypto.randomBytes(20).toString('hex');

function getLoader(loader) {
  const loaders = path.resolve('./node_modules/nullstack/loaders');
  return path.join(loaders, loader);
}

function cacheFactory(args, folder, name) {
  if (args.cache || args.environment === 'development') {
    return {
      type: 'filesystem',
      cacheDirectory: path.resolve(`./${folder}/.cache`),
      name
    };
  } else {
    return false;
  }
}

const babel = {
  test: /\.js$/,
  use: {
    loader: require.resolve('babel-loader'),
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

const nullstackJavascript = {
  test: /\.(njs|nts|jsx|tsx)$/,
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      "presets": [
        ["@babel/preset-env", { "targets": { node: "10" } }],
        "@babel/preset-react",
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

const nullstackTypescript = {
  test: /\.(nts|tsx)$/,
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      "presets": [
        ["@babel/preset-env", { "targets": { node: "10" } }],
        "@babel/preset-react",
      ],
      "plugins": [
        ["@babel/plugin-transform-typescript", { isTSX: true, allExtensions: true, tsxPragma: "Nullstack.element", tsxPragmaFrag: "Nullstack.fragment" }],
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
  const dir = argv.input ? path.join(__dirname, argv.input) : process.cwd();
  const icons = {};
  const publicFiles = readdirSync(path.join(dir, 'public'));
  for (const file of publicFiles) {
    if (file.startsWith('icon-')) {
      const size = file.split('x')[1].split('.')[0];
      icons[size] = '/' + file;
    }
  }
  const isDev = argv.environment === 'development';
  const folder = isDev ? '.development' : '.production';
  const devtool = isDev ? 'inline-cheap-module-source-map' : false;
  const minimize = !isDev;
  const plugins = isDev ? ([
    new NodemonPlugin({
      watch: path.resolve('./.development'),
      script: './.development/server.js',
      nodeArgs: ['--enable-source-maps'],
      quiet: true
    })
  ]) : [];
  return {
    mode: argv.environment,
    entry: './server.js',
    output: {
      path: path.join(dir, folder),
      filename: 'server.js',
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.njs', '.js', '.nts', '.ts', '.tsx', '.jsx']
    },
    optimization: {
      minimize: minimize,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            //keep_classnames: true,
            keep_fnames: true
          },
          // workaround: disable parallel to allow caching server
          parallel: argv.cache ? false : require('os').cpus().length - 1
        })
      ]
    },
    devtool,
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /nullstack.js$/,
          loader: getLoader('string-replace.js'),
          options: {
            multiple: [
              {
                search: /{{NULLSTACK_ENVIRONMENT_NAME}}/ig,
                replace: 'server'
              }
            ]
          }
        },
        {
          test: /environment.js$/,
          loader: getLoader('string-replace.js'),
          options: {
            multiple: [
              {
                search: /{{NULLSTACK_ENVIRONMENT_KEY}}/ig,
                replace: buildKey
              }
            ]
          }
        },
        {
          test: /project.js$/,
          loader: getLoader('string-replace.js'),
          options: {
            multiple: [
              {
                search: /{{NULLSTACK_PROJECT_ICONS}}/ig,
                replace: JSON.stringify(icons)
              }
            ]
          }
        },
        babel,
        nullstackJavascript,
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('inject-nullstack.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('register-static-from-server.js'),
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            { loader: getLoader('ignore-import.js') }
          ]
        },
        nullstackTypescript,
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('add-source-to-node.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('register-inner-components.js'),
        },
        {
          issuer: /worker.js/,
          resourceQuery: /raw/,
          type: 'asset/source',
        }
      ]
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins,
    cache: cacheFactory(argv, folder, 'server')
  }
}

function client(env, argv) {
  const dir = argv.input ? path.join(__dirname, argv.input) : process.cwd();
  const isDev = argv.environment === 'development';
  const folder = isDev ? '.development' : '.production';
  const devtool = isDev ? 'inline-cheap-module-source-map' : false;
  const minimize = !isDev;
  let liveReload = {};
  if (!isDev) {
    liveReload = {
      test: /liveReload.js$/,
      use: [
        { loader: getLoader('ignore-import.js') }
      ]
    }
  }
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "client.css"
    })
  ]
  return {
    mode: argv.environment,
    entry: './client.js',
    output: {
      publicPath: `/`,
      path: path.join(dir, folder),
      filename: 'client.js'
    },
    resolve: {
      extensions: ['.njs', '.js', '.nts', '.ts', '.tsx', '.jsx']
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
          loader: getLoader('string-replace.js'),
          options: {
            multiple: [
              {
                search: /{{NULLSTACK_ENVIRONMENT_NAME}}/ig,
                replace: 'client'
              }
            ]
          }
        },
        babel,
        nullstackJavascript,
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('remove-import-from-client.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('inject-nullstack.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('remove-static-from-client.js'),
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: require.resolve('css-loader'), options: { url: false } },
            { loader: require.resolve('sass-loader') }
          ],
        },
        liveReload,
        nullstackTypescript,
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('add-source-to-node.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('register-inner-components.js'),
        },
      ]
    },
    target: 'web',
    plugins,
    cache: cacheFactory(argv, folder, 'client')
  }
}

module.exports = [server, client]