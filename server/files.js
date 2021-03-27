import {readFileSync, readdirSync} from 'fs';
import environment from './environment';
//import {createHash} from 'crypto';
import path from 'path';
import {generateIntegrity} from './integrities';

const files = {};

//const md5 = createHash('md5');

export function getFile(file, server) {
  if(files[file] && environment.production) return files[file];
  files[file] = readFileSync(path.join(__dirname, file), 'utf-8');
  if(!server.less) {
    generateIntegrity(file, files[file]);
  }
  return files[file];
}
/*
for(const file of readdirSync(__dirname)) {
  const source = readFileSync(path.join(__dirname, file), 'utf-8');
  if(file.indexOf('server') > -1) {
    md5.update(source);
  } else {
    files[file] = source;
  }
}

for(const key in files) {
  md5.update(files[key]);
}

if(files['client.css']) {
  generateIntegrity('client.css', files['client.css']);
}

generateIntegrity('client.js', files['client.js']);

files.key = md5.digest("hex");
*/

export default files;