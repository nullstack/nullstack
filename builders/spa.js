module.exports = async function spa(folder = 'spa') {
  process.env.NULLSTACK_ENVIRONMENT_MODE = 'spa';

  const application = require('../../../.production/server').default
  const { resolve } = require('path')
  const {existsSync, mkdirSync, writeFileSync, copySync, rmSync} = require('fs-extra');

  function path(file = '') {
    return resolve(__dirname, `../../../${folder}`, file)
  }

  async function copy(url, file) {
    console.log(` ⚙️  /${file || url}`)
    const content = await application.server.prerender('/'+url);
    const target = path(file || url)
    writeFileSync(target, content)
  }

  console.log()
  if(existsSync(path())) {
    rmSync(path(), {recursive: true});
  }
  mkdirSync(path())
  console.log(` ⚙️  /public/`)
  copySync(path('../public'), path());
  await copy('/', 'index.html')
  await copy(`client-${application.environment.key}.css`)
  await copy(`client-${application.environment.key}.js`)
  await copy(`manifest-${application.environment.key}.json`)
  await copy(`service-worker-${application.environment.key}.js`)
  await copy(`offline-${application.environment.key}`)
  await copy(`404`)
  console.log()
  
  console.log('\x1b[36m%s\x1b[0m', ` ✅️ ${application.project.name} is ready at ${folder}\n`);
  process.exit()
}