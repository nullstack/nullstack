#! /usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const crypto = require('crypto');
const concurrently = require('concurrently');

const currentFolder = process.cwd();
const packageFolder = process.argv[1].replace('cli.js', '');
const command = process.argv[2];
const projectName = process.argv[3];

if(command == 'new') {
  const projectFolder = projectName.split(/(?=[A-Z])/).join('_').toLowerCase();
  fs.mkdirSync(projectFolder);
  fs.mkdirSync(`${projectFolder}/build`);
  fs.mkdirSync(`${projectFolder}/src`);
  fs.mkdirSync(`${projectFolder}/uploads`);
  fs.mkdirSync(`${projectFolder}/dist`);
  fs.mkdirSync(`${projectFolder}/public`);
  let packageJSON = fs.readFileSync(`${packageFolder}/template/package.json`, "utf8");
  packageJSON = packageJSON.replace(new RegExp("{{PROJECT_NAME}}", "g"), projectName);
  fs.writeFileSync(`${projectFolder}/package.json`, packageJSON);
  let styles = fs.readFileSync(`${packageFolder}/template/styles.scss`, "utf8");
  fs.writeFileSync(`${projectFolder}/src/styles.scss`, styles);
  let index = fs.readFileSync(`${packageFolder}/template/index.js`, "utf8");
  index = index.replace(new RegExp("{{PROJECT_NAME}}", "g"), projectName);
  index = index.replace(new RegExp("{{SESSION_SECRET}}", "g"), crypto.randomBytes(32).toString('hex'));
  fs.writeFileSync(`${projectFolder}/src/index.js`, index);
  let dashboard = fs.readFileSync(`${packageFolder}/template/page.js`, "utf8");
  dashboard = dashboard.replace(new RegExp("{{PROJECT_NAME}}", "g"), projectName);
  dashboard = dashboard.replace(new RegExp("{{PAGE_NAME}}", "g"), 'Dashboard');
  fs.writeFileSync(`${projectFolder}/src/dashboard.js`, dashboard);
  console.log("Your project is being created, this may take a while...");
  concurrently([{
    command: `cd ${projectFolder} && npm install`,
    name: 'nullstack'
  }]).then(() => {
    console.log("Your Nullstack project is ready!");
    console.log(`Type "cd ${projectFolder}" to explore it ...`);
    console.log(`Then type "nullstack" to run it!`);
  });
} else if (command == 'client') {
  concurrently([{
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.client.dev.js --watch',
    name: 'client'
  }]);
} else if (command == 'server') {
  concurrently([{
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.server.dev.js --watch',
    name: 'server'
  }]);
} else if (command == 'dist') {
  concurrently([{
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.client.prod.js',
    name: 'client'
  }, {
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.server.prod.js',
    name: 'server'
  }]);
} else if (command == 'generate') {
  const pageName = process.argv[4];
  const fileName = pageName.split(/(?=[A-Z])/).join('_').toLowerCase();
  const route = pageName.split(/(?=[A-Z])/).join('-').toLowerCase();
  let page = fs.readFileSync(`${packageFolder}/template/page.js`, "utf8");
  page = page.replace(new RegExp("{{PROJECT_NAME}}", "g"), pageName);
  page = page.replace(new RegExp("{{PAGE_NAME}}", "g"), pageName);
  fs.writeFileSync(`src/${fileName}.js`, page);
  console.log(`Nullstack created src/${fileName}.js and imported ${pageName} in src/index.js`);
  let index = fs.readFileSync(`src/index.js`, "utf8");
  index = index.replace("ready();", `import ${pageName} from './${fileName}';\nroute('/${route}', ${pageName});\n\nready();`);
  fs.writeFileSync(`src/index.js`, index);
} else {
  concurrently([{
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.client.dev.js --watch',
    name: 'client'
  }, {
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.server.dev.js --watch',
    name: 'server'
  }]);
}
