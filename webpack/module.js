const path = require('path')
const { readdirSync } = require('fs')

function icons(options) {
  const icons = {}
  const publicFiles = readdirSync(path.posix.join(options.projectFolder, 'public'))
  const iconFileRegex = /icon-(\d+)x\1\.[a-zA-Z]+/
  for (const file of publicFiles) {
    if (iconFileRegex.test(file)) {
      const size = file.split('x')[1].split('.')[0]
      icons[size] = `/${file}`
    }
  }
  return { ICONS: JSON.stringify(icons) }
}

function environment(_options) {
  const crypto = require('crypto')
  const key = crypto.randomBytes(20).toString('hex')
  return { KEY: `"${key}"` }
}

function scss(options) {
  if (options.target !== 'client') return

  return {
    test: /\.s[ac]ss$/,
    use: [
      {
        loader: require.resolve('sass-loader'),
        options: { sassOptions: { fibers: false } }
      }
    ],
  }
}

function css(options) {
  if (options.target !== 'client') return

  const { loader } = require('mini-css-extract-plugin')
  return {
    test: /\.s?[ac]ss$/,
    use: [
      loader,
      {
        loader: require.resolve('css-loader'),
        options: { url: false }
      }
    ],
  }
}

function swc(options, other) {
  const config = {
    test: other.test,
    use: {
      loader: require.resolve('swc-loader'),
      options: { jsc: {}, env: {} }
    }
  }

  config.use.options.jsc.experimental = {
    cacheRoot: path.posix.join(options.projectFolder, options.buildFolder, '.cache', '.swc'),
    plugins: [
      [
        require.resolve('swc-plugin-nullstack'),
        {
          development: options.environment === 'development',
          client: options.target === 'client',
          template: !!other.template
        }
      ]
    ]
  }

  if (options.target === 'server') {
    config.use.options.env.targets = { node: process.versions.node }
  } else {
    config.use.options.env.targets = 'defaults'
  }

  config.use.options.jsc.parser = {
    syntax: other.syntax,
    exportDefaultFrom: true,
  }

  if (other.template) {
    config.use.options.jsc.parser[other.template] = true
  }

  config.use.options.jsc.transform = {
    useDefineForClassFields: false,
    react: {
      pragma: '$runtime.element',
      pragmaFrag: '$runtime.fragment',
      runtime: 'classic',
      throwIfNamespace: true,
    },
  }

  if (options.target === 'server' && !other.template) {
    config.use.options.jsc.transform.constModules = {
      globals: {
        "nullstack/environment": environment(options),
        "nullstack/project": icons(options),
      }
    }
  }

  return config
}

function js(options) {
  return swc(options, {
    test: /\.js$/,
    syntax: 'ecmascript',
  })
}

function ts(options) {
  return swc(options, {
    test: /\.ts$/,
    syntax: 'typescript',
  })
}

function njs(options) {
  return swc(options, {
    test: /\.(njs|jsx)$/,
    syntax: 'ecmascript',
    template: 'jsx',
  })
}

function nts(options) {
  return swc(options, {
    test: /\.(nts|tsx)$/,
    syntax: 'typescript',
    template: 'tsx',
  })
}

function shutUp(options) {
  return {
    test: /node_modules[\\/](webpack[\\/]hot|webpack-hot-middleware|mini-css-extract-plugin)/,
    loader: path.posix.join(options.configFolder, 'loaders', 'shut-up-loader.js'),
  }
}

function raw() {
  return {
    issuer: /worker.js/,
    resourceQuery: /raw/,
    type: 'asset/source',
  }
}

function runtime(options) {
  return {
    test: /\.(nts|tsx|njs|jsx)$/,
    loader: path.posix.join(options.configFolder, 'loaders', 'inject-runtime.js'),
  }
}

function debug(options) {
  return {
    test: /\.(nts|tsx|njs|jsx)$/,
    loader: path.posix.join(options.configFolder, 'loaders', 'debug.js'),
  }
}

function rules(options) {
  return [
    debug(options),
    css(options),
    scss(options),
    js(options),
    ts(options),
    njs(options),
    nts(options),
    shutUp(options),
    raw(options),
    runtime(options)
  ].filter(Boolean)
}

function iWishModuleWasntAReservedWord(options) {
  return {
    rules: rules(options)
  }
}

module.exports = iWishModuleWasntAReservedWord