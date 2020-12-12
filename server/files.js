import {readFileSync, readdirSync} from 'fs';
import {createHash} from 'crypto';
import path from 'path';

const files = {};

const md5 = createHash('md5');

for(const file of readdirSync(__dirname)) {
  const source = readFileSync(path.join(__dirname, file));
  if(file.indexOf('server') > -1) {
    md5.update(source);
  } else {
    files[file] = source;
  }
}

for(const key in files) {
  md5.update(files[key]);
}

files.key = md5.digest("hex");

export default files;