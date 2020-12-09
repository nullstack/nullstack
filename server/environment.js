import {readFileSync, readdirSync} from 'fs';
import {createHash} from 'crypto';
import path from 'path';

const environment = {client: false, server: true};

environment.development = __dirname.indexOf('.development') > -1;
environment.production = !environment.development;

environment.static = process.argv[2] === '--static';

const md5 = createHash('md5');
for(const file of readdirSync(__dirname)) {
  const source = readFileSync(path.join(__dirname, file));
  md5.update(source);
}

environment.key = md5.digest("hex");

Object.freeze(environment);

export default environment;