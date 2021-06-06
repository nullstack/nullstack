module.exports = async function ssr() {
  const application = require('../../../.production/server').default;
  
  console.log('\x1b[36m%s\x1b[0m', `\n ✅️ ${application.project.name} is ready for production\n`);

  process.exit()
}