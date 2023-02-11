const CopyPlugin = require('copy-webpack-plugin')
const crypto = require('crypto')
const { existsSync, readdirSync } = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require(`webpack`)

const { version } = require('./package.json')

const buildKey = crypto.randomBytes(20).toString('hex')

function getLoader(loader) {
  const loaders = path.resolve(__dirname, 'loaders')
  return path.posix.join(loaders, loader)
}

function cacheFactory(args, folder, name) {
  if (args.cache || args.environment === 'development') {
    return {
      type: 'filesystem',
      cacheDirectory: path.posix.join(process.cwd(), folder, '.cache'),
      name,
      version,
    }
  }
  return false
}

function terserMinimizer(file, _sourceMap) {
  return require('@swc/core').minify(file, {
    mangle: false,
    compress: {
      unused: false,
    },
    keepClassnames: true,
    keepFnames: true,
    sourceMap: true,
  })
}

function getTargets({ environment, target }) {
  if (target === 'node') {
    return { node: process.versions.node }
  }
  return environment === 'development' ? 'last 1 version' : 'defaults'
}

function swcJs({ environment, target }) {
  const targets = getTargets({ environment, target })
  return {
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
          targets,
        },
      },
    },
  }
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

function swcTs({ environment, target }) {
  const targets = getTargets({ environment, target })
  return {
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
          targets,
        },
      },
    },
  }
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

function swcNullstackJavascript({ environment, target }) {
  const targets = getTargets({ environment, target })
  return {
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
          targets,
        },
      },
    },
  }
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

function swcNullstackTypescript({ environment, target }) {
  const targets = getTargets({ environment, target })
  return {
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
          targets,
        },
      },
    },
  }
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
  const entryExtension = existsSync(path.posix.join(process.cwd(), 'server.ts')) ? 'ts' : 'js'
  const icons = {}
  const publicFiles = readdirSync(path.posix.join(process.cwd(), 'public'))
  const babel = argv.loader === 'babel'
  const iconFileRegex = /icon-(\d+)x\1\.[a-zA-Z]+/
  for (const file of publicFiles) {
    if (iconFileRegex.test(file)) {
      const size = file.split('x')[1].split('.')[0]
      icons[size] = `/${file}`
    }
  }
  const isDev = argv.environment === 'development'
  const folder = isDev ? '.development' : '.production'
  const devtool = isDev ? 'inline-cheap-module-source-map' : 'source-map'
  const minimize = !isDev
  const plugins = []
  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
    plugins.push(
      new NodemonPlugin({
        ext: '*',
        watch: ['.env', '.env.*', './server.js'],
        script: './.development/server.js',
        nodeArgs: ['--enable-source-maps'],
        quiet: true,
      }),
    )
  }
  return {
    mode: argv.environment,
    infrastructureLogging: { level: 'error' },
    entry: isDev
      ? ['webpack/hot/poll?1000', path.posix.join(__dirname, 'shared', 'accept.js'), `./server.${entryExtension}`]
      : `./server.${entryExtension}`,
    output: {
      path: path.posix.join(process.cwd(), folder),
      filename: 'server.js',
      chunkFilename: '[chunkhash].server.js',
      libraryTarget: 'umd',
      hotUpdateChunkFilename: 'nullstack-server-update-[id]-[fullhash].js',
      hotUpdateMainFilename: 'nullstack-server-update-[runtime]-[fullhash].json',
      pathinfo: false,
      // clean: isDev,
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
    stats: 'none',
    module: {
      rules: [
        {
          test: /server\.(js|ts)$/,
          exclude: /node_modules/,
          loader: getLoader('inject-server-hmr.js'),
        },
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
        babel ? babelJs : swcJs({ environment: argv.environment, target: 'node' }),
        babel ? babelTs : swcTs({ environment: argv.environment, target: 'node' }),
        babel ? babelNullstackJavascript : swcNullstackJavascript({ environment: argv.environment, target: 'node' }),
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
        babel ? babelNullstackTypescript : swcNullstackTypescript({ environment: argv.environment, target: 'node' }),
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
        {
          test: /webpack[\\\/]hot/,
          loader: getLoader('shut-up-loader.js')
        },
        {
          test: /webpack-hot-middleware/,
          loader: getLoader('shut-up-loader.js')
        }
      ],
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins,
    externals: { 'webpack/hot/poll': 'webpack/hot/poll?1000' },
    cache: cacheFactory(argv, folder, 'server'),
  }
}

function client(env, argv) {
  const disk = !!argv.disk
  const entryExtension = existsSync(path.posix.join(process.cwd(), 'client.ts')) ? 'ts' : 'js'
  const isDev = argv.environment === 'development'
  const folder = isDev ? '.development' : '.production'
  const devtool = isDev ? 'inline-cheap-module-source-map' : 'source-map'
  const minimize = !isDev
  const babel = argv.loader === 'babel'
  const plugins = []
  plugins.push(
    new MiniCssExtractPlugin({
      filename: 'client.css',
      chunkFilename: '[chunkhash].client.css',
    }),
  )
  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  if (disk) {
    plugins.push(
      new CopyPlugin({
        patterns: [{ from: 'public', to: '../.development' }],
      }),
    )
  }
  return {
    mode: argv.environment,
    infrastructureLogging: { level: 'error' },
    entry: isDev
      ? [
          'webpack-hot-middleware/client?log=false&path=/nullstack/hmr&noInfo=true&quiet=true&timeout=20000',
          path.posix.join(__dirname, 'shared', 'accept.js'),
          `./client.${entryExtension}`,
        ]
      : `./client.${entryExtension}`,
    output: {
      publicPath: `/`,
      path: path.posix.join(process.cwd(), folder),
      filename: 'client.js',
      chunkFilename: '[chunkhash].client.js',
      hotUpdateChunkFilename: 'nullstack-client-update-[id]-[fullhash].js',
      hotUpdateMainFilename: 'nullstack-client-update-[runtime]-[fullhash].json',
      pathinfo: false,
      // clean: isDev,
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
    stats: 'none',
    module: {
      rules: [
        {
          test: /client\.(js|ts)$/,
          exclude: /node_modules/,
          loader: getLoader('inject-client-hmr.js'),
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
        babel ? babelJs : swcJs({ environment: argv.environment, target: 'web' }),
        babel ? babelTs : swcTs({ environment: argv.environment, target: 'web' }),
        babel ? babelNullstackJavascript : swcNullstackJavascript({ environment: argv.environment, target: 'node' }),
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
          use: [MiniCssExtractPlugin.loader, { loader: require.resolve('css-loader'), options: { url: false } }],
        },
        {
          test: /\.s[ac]ss$/,
          use: [{ loader: require.resolve('sass-loader'), options: { sassOptions: { fibers: false } } }],
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('register-inner-components.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('inject-nullstack.js'),
        },
        babel ? babelNullstackTypescript : swcNullstackTypescript({ environment: argv.environment, target: 'node' }),
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('add-source-to-node.js'),
        },
        {
          test: /\.(njs|nts|jsx|tsx)$/,
          loader: getLoader('transform-node-ref.js'),
        },
        {
          test: /webpack[\\\/]hot/,
          loader: getLoader('shut-up-loader.js')
        },
        {
          test: /webpack-hot-middleware/,
          loader: getLoader('shut-up-loader.js')
        }
      ],
    },
    target: 'web',
    externals: {
      'webpack-hot-middleware/client':
        'webpack-hot-middleware/client?log=false&path=/nullstack/hmr&noInfo=true&quiet=true&timeout=20000',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins,
    cache: cacheFactory(argv, folder, 'client'),
  }
}

module.exports = [server, client]
