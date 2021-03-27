import {readFileSync} from 'fs';
import environment from './environment';
import path from 'path';
import {generateIntegrity} from './integrities';

const files = {};

export function generateFile(file, server) {
  if(files[file] && environment.production) return files[file];
  files[file] = readFileSync(path.join(__dirname, file), 'utf-8');
  if(!server.less && environment.production) {
    generateIntegrity(file, files[file]);
  }
  return files[file];
}

export default files;