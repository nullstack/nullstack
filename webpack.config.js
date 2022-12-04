const CopyPlugin = require('copy-webpack-plugin')
const crypto = require('crypto')
const { existsSync, readdirSync } = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const buildKey = crypto.randomBytes(20).toString('hex')

const customConsole = new Proxy(
  {},
  {
    get() {
      return () => {}
    },
  },
)

function getLoader(loader) {
  const loaders = path.resolve('./node_modules/nullstack/loaders')
  return path.join(loaders, loader)
}

function cacheFactory(args, folder, name) {
  if (args.cache || args.environment === 'development') {
    return {
      type: 'filesystem',
      cacheDirectory: path.resolve(`./${folder}/.cache`),
      name,
    }
  }
  return false
}

function terserMinimizer(file, _sourceMap) {
  return require('@swc/core').minify(file, {
    keepClassnames: true,
    keepFnames: true,
  })
}

const swcJs = {
  test: /\.js$/,
  use: {
    loader: require.resolve('swc-loader'),
    options: {
      jsc: {
        parser: {
          syntax: 'ecmascript',
          exportDefaultFrom: true,
        },
      },
      env: {
        targets: { node: '10' },
      },
    },
  },
}

const babelJs = {
  test: /\.js$/,
  resolve: {
    extensions: ['.njs', '.js', '.nts', '.ts', '.jsx', '.tsx'],
  },
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['@babel/preset-env', { targets: { node: '10' } }]],
      plugins: ['@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-class-properties'],
    },
  },
}

const swcTs = {
  test: /\.ts$/,
  use: {
    loader: require.resolve('swc-loader'),
    options: {
      jsc: {
        parser: {
          syntax: 'typescript',
          exportDefaultFrom: true,
        },
      },
      env: {
        targets: { node: '10' },
      },
    },
  },
}

const babelTs = {
  test: /\.ts$/,
  resolve: {
    extensions: ['.njs', '.js', '.nts', '.ts', '.jsx', '.tsx'],
  },
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['@babel/preset-env', { targets: { node: '10' } }], '@babel/preset-react'],
      plugins: ['@babel/plugin-transform-typescript'],
    },
  },
}

const swcNullstackJavascript = {
  test: /\.(njs|nts|jsx|tsx)$/,
  use: {
    loader: require.resolve('swc-loader'),
    options: {
      jsc: {
        parser: {
          syntax: 'ecmascript',
          exportDefaultFrom: true,
          jsx: true,
        },
        transform: {
          react: {
            pragma: 'Nullstack.element',
            pragmaFrag: 'Nullstack.fragment',
            throwIfNamespace: true,
          },
        },
      },
      env: {
        targets: { node: '10' },
      },
    },
  },
}

const babelNullstackJavascript = {
  test: /\.(njs|jsx)$/,
  resolve: {
    extensions: ['.njs', '.js', '.nts', '.ts', '.jsx', '.tsx'],
  },
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['@babel/preset-env', { targets: { node: '10' } }], '@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties',
        [
          '@babel/plugin-transform-react-jsx',
          {
            pragma: 'Nullstack.element',
            pragmaFrag: 'Nullstack.fragment',
            throwIfNamespace: false,
          },
        ],
      ],
    },
  },
}

const swcNullstackTypescript = {
  test: /\.(nts|tsx)$/,
  use: {
    loader: require.resolve('swc-loader'),
    options: {
      jsc: {
        parser: {
          syntax: 'typescript',
          exportDefaultFrom: true,
          tsx: true,
        },
        transform: {
          react: {
            pragma: 'Nullstack.element',
            pragmaFrag: 'Nullstack.fragment',
            throwIfNamespace: true,
          },
        },
      },
      env: {
        targets: { node: '10' },
      },
    },
  },
}

const babelNullstackTypescript = {
  test: /\.(nts|tsx)$/,
  resolve: {
    extensions: ['.njs', '.js', '.nts', '.ts', '.jsx', '.tsx'],
  },
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['@babel/preset-env', { targets: { node: '10' } }], '@babel/preset-react'],
      plugins: [
        [
          '@babel/plugin-transform-typescript',
          {
            isTSX: true,
            allExtensions: true,
            tsxPragma: 'Nullstack.element',
            tsxPragmaFrag: 'Nullstack.fragment',
          },
        ],
        [
          '@babel/plugin-transform-react-jsx',
          {
            pragma: 'Nullstack.element',
            pragmaFrag: 'Nullstack.fragment',
            throwIfNamespace: false,
          },
        ],
      ],
    },
  },
}

function server(env, argv) {
  const dir = argv.input ? path.join(__dirname, argv.input) : process.cwd()
  const entryExtension = existsSync(path.join(dir, 'server.ts')) ? 'ts' : 'js'
  const icons = {}
  const publicFiles = readdirSync(path.join(dir, 'public'))
  const babel = argv.loader === 'babel'
  for (const file of publicFiles) {
    if (file.startsWith('icon-')) {
      const size = file.split('x')[1].split('.')[0]
      icons[size] = `/${file}`
    }
  }
  const isDev = argv.environment === 'development'
  const folder = isDev ? '.development' : '.production'
  const devtool = isDev ? 'inline-cheap-module-source-map' : false
  const minimize = !isDev
  const plugins = []
  if (isDev) {
    plugins.push(
      new NodemonPlugin({
        ext: '*',
        watch: ['.env', '.env.*', './.development/server.js'],
        script: './.development/server.js',
        nodeArgs: ['--enable-source-maps'],
        quiet: true,
      }),
    )
  }
  return {
    mode: argv.environment,
    infrastructureLogging: {
      console: customConsole,
    },
    entry: `./server.${entryExtension}`,
    output: {
      path: path.join(dir, folder),
      filename: 'server.js',
      chunkFilename: '[chunkhash].server.js',
      libraryTarget: 'umd',
    },
    resolve: {
      extensions: ['.njs', '.js', '.nts', '.ts', '.tsx', '.jsx'],
    },
    optimization: {
      minimize,
      minimizer: [
        new TerserPlugin({
          minify: terserMinimizer,
          // workaround: disable parallel to allow caching server
          parallel: argv.cache ? false : require('os').cpus().length - 1,
        }),
      ],
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
                search: /{{NULLSTACK_ENVIRONMENT_NAME}}/gi,
                replace: 'server',
              },
            ],
          },
        },
        {
          test: /environment.js$/,
          loader: getLoader('string-replace.js'),
          options: {
            multiple: [
              {
                search: /{{NULLSTACK_ENVIRONMENT_KEY}}/gi,
                replace: buildKey,
              },
            ],
          },
        },
        {
          test: /project.js$/,
          loader: getLoader('string-replace.js'),
          options: {
            multiple: [
              {
                search: /{{NULLSTACK_PROJECT_ICONS}}/gi,
                replace: JSON.stringify(icons),
              },
            ],
          },
        },
        babel ? babelJs : swcJs,
        babel ? babelTs : swcTs,
        babel ? babelNullstackJavascript : swcNullstackJavascript,
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('register-static-from-server.js'),
        },
        {
          test: /\.s?[ac]ss$/,
          use: [{ loader: getLoader('ignore-import.js') }],
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('register-inner-components.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('inject-nullstack.js'),
        },
        babel ? babelNullstackTypescript : swcNullstackTypescript,
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('add-source-to-node.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('transform-node-ref.js'),
        },
        {
          issuer: /worker.js/,
          resourceQuery: /raw/,
          type: 'asset/source',
        },
      ],
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins,
    cache: cacheFactory(argv, folder, 'server'),
  }
}

function client(env, argv) {
  const disk = !!argv.disk
  const dir = argv.input ? path.join(__dirname, argv.input) : process.cwd()
  const entryExtension = existsSync(path.join(dir, 'client.ts')) ? 'ts' : 'js'
  const isDev = argv.environment === 'development'
  const folder = isDev ? '.development' : '.production'
  const devtool = isDev ? 'inline-cheap-module-source-map' : false
  const minimize = !isDev
  const babel = argv.loader === 'babel'
  const plugins = [
    new MiniCssExtractPlugin({
      filename: 'client.css',
      chunkFilename: '[chunkhash].client.css',
    }),
  ]
  if (disk) {
    plugins.push(
      new CopyPlugin({
        patterns: [{ from: 'public', to: '../.development' }],
      }),
    )
  }
  return {
    infrastructureLogging: {
      console: customConsole,
    },
    mode: argv.environment,
    entry: `./client.${entryExtension}`,
    output: {
      publicPath: `/`,
      path: path.join(dir, folder),
      filename: 'client.js',
      chunkFilename: '[chunkhash].client.js',
    },
    resolve: {
      extensions: ['.njs', '.js', '.nts', '.ts', '.tsx', '.jsx'],
    },
    optimization: {
      minimize,
      minimizer: [
        new TerserPlugin({
          minify: terserMinimizer,
        }),
      ],
    },
    devtool,
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /client\.(js|ts)$/,
          loader: getLoader('inject-hmr.js'),
        },
        {
          test: /nullstack.js$/,
          loader: getLoader('string-replace.js'),
          options: {
            multiple: [
              {
                search: /{{NULLSTACK_ENVIRONMENT_NAME}}/gi,
                replace: 'client',
              },
            ],
          },
        },
        babel ? babelJs : swcJs,
        babel ? babelTs : swcTs,
        babel ? babelNullstackJavascript : swcNullstackJavascript,
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('remove-import-from-client.js'),
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
            { loader: require.resolve('sass-loader'), options: { sassOptions: { fibers: false } } },
          ],
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('register-inner-components.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('inject-nullstack.js'),
        },
        babel ? babelNullstackTypescript : swcNullstackTypescript,
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('add-source-to-node.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('transform-node-ref.js'),
        },
      ],
    },
    target: 'web',
    plugins,
    cache: cacheFactory(argv, folder, 'client'),
  }
}

module.exports = [server, client]
