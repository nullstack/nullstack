const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const crypto = require("crypto");
const { readdirSync } = require('fs');
const { HotModuleReplacementPlugin } = require('webpack')

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

function terserMinimizer(file, _sourceMap) {
  return require('@swc/core').minify(file, {
    keepClassnames: true,
    keepFnames: true
  })
}

const swc = {
  test: /\.js$/,
  use: {
    loader: require.resolve('swc-loader'),
    options: {
      jsc: {
        parser: {
          syntax: "ecmascript",
          exportDefaultFrom: true
        }
      },
      env: {
        targets: { node: "10" }
      }
    }
  }
};

const nullstackJavascript = {
  test: /\.(njs|nts|jsx|tsx)$/,
  use: {
    loader: require.resolve('swc-loader'),
    options: {
      jsc: {
        parser: {
          syntax: "ecmascript",
          exportDefaultFrom: true,
          jsx: true
        },
        transform: {
          react: {
            pragma: "Nullstack.element",
            pragmaFrag: "Nullstack.fragment",
            throwIfNamespace: true
          }
        }
      },
      env: {
        targets: { node: "10" }
      }
    }
  }
};

const nullstackTypescript = {
  test: /\.(nts|tsx)$/,
  use: {
    loader: require.resolve('swc-loader'),
    options: {
      jsc: {
        parser: {
          syntax: "typescript",
          exportDefaultFrom: true,
          tsx: true
        },
        transform: {
          react: {
            pragma: "Nullstack.element",
            pragmaFrag: "Nullstack.fragment",
            throwIfNamespace: true
          }
        }
      },
      env: {
        targets: { node: "10" }
      }
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
  const plugins = []
  if (isDev) {
    plugins.push(new NodemonPlugin({
      ext: '*',
      watch: [".env", ".env.*", './.development/*.*'],
      script: './.development/server.js',
      nodeArgs: ['--enable-source-maps'],
      quiet: true
    }))
  }
  return {
    mode: argv.environment,
    entry: './server.js',
    output: {
      path: path.join(dir, folder),
      filename: 'server.js',
      chunkFilename: '[chunkhash].server.js',
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.njs', '.js', '.nts', '.ts', '.tsx', '.jsx']
    },
    optimization: {
      minimize: minimize,
      minimizer: [
        new TerserPlugin({
          minify: terserMinimizer,
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
        swc,
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
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "client.css",
      chunkFilename: '[chunkhash].client.css'
    })
  ]
  if (isDev) {
    plugins.push(new HotModuleReplacementPlugin())
  }
  return {
    infrastructureLogging: {
      level: 'none',
    },
    mode: argv.environment,
    entry: './client.js',
    output: {
      publicPath: `/`,
      path: path.join(dir, folder),
      filename: 'client.js',
      chunkFilename: '[chunkhash].client.js',
    },
    resolve: {
      extensions: ['.njs', '.js', '.nts', '.ts', '.tsx', '.jsx']
    },
    optimization: {
      minimize: minimize,
      minimizer: [
        new TerserPlugin({
          minify: terserMinimizer
        })
      ]
    },
    devtool,
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /client.js$/,
          loader: getLoader('inject-hmr.js'),
        },
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
        swc,
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