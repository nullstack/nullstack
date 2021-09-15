module.exports = async function spa(folder = 'spa') {
  process.env.NULLSTACK_ENVIRONMENT_MODE = 'spa';

  const dir = process.cwd();
  const application = require(`${dir}/.production/server`).default
  const { resolve } = require('path')
  const { existsSync, mkdirSync, writeFileSync, copySync, rmSync } = require('fs-extra');

  function path(file = '') {
    return resolve(`${dir}/${folder}`, file)
  }

  async function copy(url, file) {
    console.log(` ⚙️  /${file || url}`)
    const content = await application.server.prerender('/' + url);
    const target = path(file || url)
    writeFileSync(target, content)
  }

  console.log()
  if (existsSync(path())) {
    rmSync(path(), { recursive: true });
  }
  mkdirSync(path())
  console.log(` ⚙️  /public/`)
  copySync(path('../public'), path());
  await copy('/', 'index.html')
  await copy(`/nullstack/${application.environment.key}client.css`)
  await copy(`/nullstack/${application.environment.key}client.js`)
  await copy(`/manifest.json`)
  await copy(`/service-worker.js`)
  await copy(`/nullstack/${application.environment.key}offline`)
  await copy(`404`)
  console.log()

  console.log('\x1b[36m%s\x1b[0m', ` ✅️ ${application.project.name} is ready at ${folder}\n`);
  process.exit()
}