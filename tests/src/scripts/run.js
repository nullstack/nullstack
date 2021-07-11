const {default: application} = require('../../.development/server.js');

async function getProjectName() {
  const { project } = await application.start();
  console.log(project.name);
}

getProjectName();