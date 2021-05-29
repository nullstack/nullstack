process.env.NULLSTACK_ENVIRONMENT_MODE = 'spa';

const application = require('../../../.production/server').default
const { resolve } = require('path')
const {existsSync, mkdirSync, writeFileSync, copySync, rmSync} = require('fs-extra');

const argv = process.argv.find((a) => a.startsWith('--folder'))
const folder = argv ? argv.split('=')[1] : 'spa'

function path(file = '') {
  return resolve(__dirname, `../../../${folder}`, file)
}

async function copy(url, file) {
  const content = await application.server.prerender('/'+url, {empty: true});
  const target = path(file || url)
  writeFileSync(target, content)
}

async function build() {
  if(existsSync(path())) {
    rmSync(path(), {recursive: true});
  }
  mkdirSync(path())
  copySync(path('../public'), path());
  await copy('/', 'index.html')
  await copy(`client-${application.environment.key}.css`)
  await copy(`client-${application.environment.key}.js`)
  await copy(`manifest-${application.environment.key}.json`)
  await copy(`service-worker-${application.environment.key}.js`)
  await copy(`offline-${application.environment.key}`)
  await copy(`404`)
}

build()