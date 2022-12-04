process.env.NULLSTACK_ENVIRONMENT_NAME = 'test'

const { default: application } = require('../../.production/server.js')

async function getProjectName() {
  await application.start()
  const { project } = application
  console.info(project.name)
}

getProjectName()
