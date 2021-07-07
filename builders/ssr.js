module.exports = async function ssr(input) {
  const dir = input || '../..';
  const application = require('../'+dir+'/.production/server').default;
  
  console.log('\x1b[36m%s\x1b[0m', `\n ✅️ ${application.project.name} is ready for production\n`);

  process.exit()
}