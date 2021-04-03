import application from '../../.production/server.js';

application.run((context) => {
  console.log(context.project.name);
})