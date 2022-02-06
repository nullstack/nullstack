module.exports = async function ssr({ cache }) {
  const dir = process.cwd();
  const application = require(`${dir}/.production/server`).default;
  
  console.log('\x1b[36m%s\x1b[0m', `\n ✅️ ${application.project.name} is ready for production\n`);

  if (cache) {
    console.log('Storing cache...');
  } else {
    process.exit();
  }
}