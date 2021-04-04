import environment from './environment';

const project = {};

project.type = "website";
project.display = "standalone";
project.orientation = "portrait";
project.scope = "/";
project.root = "/";
project.favicon = "/favicon-96x96.png";
project.icons = JSON.parse(`{{NULLSTACK_PROJECT_ICONS}}`);
project.disallow = [];
project.sitemap = environment.static;
project.cdn = '';
project.protocol = environment.development ? 'http' : 'https';

export default project;