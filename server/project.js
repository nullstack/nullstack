import path from 'path';
import {readdirSync} from 'fs';
import environment from './environment';

const project = {};

project.type = "website";
project.display = "standalone";
project.orientation = "portrait";
project.scope = "/";
project.root = "/";
project.favicon = "/favicon-96x96.png";
project.icons = {};
project.disallow = [];
project.sitemap = environment.static;
project.cdn = '';
project.protocol = environment.development ? 'http' : 'https';

const publicFiles = readdirSync(path.join(__dirname, '..', 'public'));

for(const file of publicFiles) {
  if(file.startsWith('icon-')) {
    const size = file.split('x')[1].split('.')[0];
    project.icons[size] = '/' + file;
  }
}

export default project;