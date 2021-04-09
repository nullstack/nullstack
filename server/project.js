import environment from './environment';
import server from './server';

const project = {};

project.cdn = process.env['NULLSTACK_PROJECT_CDN'] ?? '';
project.protocol = process.env['NULLSTACK_PROJECT_PROTOCOL'] ?? (environment.development ? 'http' : 'https');
project.domain = process.env['NULLSTACK_PROJECT_DOMAIN']
project.name = process.env['NULLSTACK_PROJECT_NAME']
project.shortName = process.env['NULLSTACK_PROJECT_SHORT_NAME']
project.color = process.env['NULLSTACK_PROJECT_COLOR']

project.type = 'website';
project.display = 'standalone';
project.orientation = 'portrait';
project.scope = '/';
project.root = '/';
project.sitemap = environment.static;
project.favicon = '/favicon-96x96.png';
project.disallow = [];
project.icons = JSON.parse(`{{NULLSTACK_PROJECT_ICONS}}`);

export function generateBase() {
  const port = project.domain === 'localhost' ? `:${server.port}` : '';
  return `${project.protocol}://${project.domain}${port}`;
}

export default project;