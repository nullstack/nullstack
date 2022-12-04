module.exports = async function spa({ output, cache, environment }) {
  const folder = output || 'spa'
  process.env.NULLSTACK_ENVIRONMENT_MODE = 'spa'

  const dir = process.cwd()
  const application = require(`${dir}/.${environment}/server`).default
  const projectName = application.project.name || 'The Nullstack application'
  const { existsSync, mkdirSync, writeFileSync, copySync, removeSync } = require('fs-extra')
  const path = `${dir}/${folder}`

  async function copy(url, file) {
    console.info(` ⚙️  ${file || url}`)
    const content = await application.server.prerender(url)
    const target = `${dir}/${folder}${file || url}`
    writeFileSync(target, content)
  }

  function filter(src, dest) {
    return dest.endsWith(folder) || (src.includes('client') && !src.includes('.txt'))
  }

  console.info()
  if (existsSync(path)) {
    removeSync(path)
  }
  mkdirSync(path)
  console.info(` ⚙️  /public/`)
  copySync(`${dir}/public`, path)
  await copy('/', '/index.html')
  console.info(` ⚙️  /.${environment}/`)
  copySync(`${dir}/.${environment}`, path, { filter })
  await copy(`/manifest.webmanifest`)
  await copy(`/service-worker.js`)
  await copy('/robots.txt')
  console.info()

  console.info('\x1b[36m%s\x1b[0m', ` ✅️ ${projectName} is ready at ${folder}\n`)

  if (cache) {
    console.info('Storing cache...')
  } else if (environment === 'production') {
    process.exit()
  }
}
