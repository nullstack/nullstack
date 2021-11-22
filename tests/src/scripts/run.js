const { default: application } = require('../../.development/server.js');

async function getProjectName() {
  await application.start();
  const { project } = application
  console.log(project.name);
}

getProjectName();