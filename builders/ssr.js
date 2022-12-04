module.exports = async function ssr({ cache }) {
  const dir = process.cwd()
  const application = require(`${dir}/.production/server`).default
  const projectName = application.project.name || 'The Nullstack application'

  console.info('\x1b[36m%s\x1b[0m', `\n ✅️ ${projectName} is ready for production\n`)

  if (cache) {
    console.info('Storing cache...')
  } else {
    process.exit()
  }
}
