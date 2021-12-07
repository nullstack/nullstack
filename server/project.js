import environment from './environment';
import server from './server';
import worker from './worker';

const project = {};

project.domain = process.env['NULLSTACK_PROJECT_DOMAIN']
project.name = process.env['NULLSTACK_PROJECT_NAME']
project.shortName = process.env['NULLSTACK_PROJECT_SHORT_NAME']
project.color = process.env['NULLSTACK_PROJECT_COLOR']
project.viewport = process.env['NULLSTACK_PROJECT_VIEWPORT']
project.type = 'website';
project.display = 'standalone';
project.orientation = 'portrait';
project.scope = '/';
project.root = '/';
project.sitemap = environment.mode === 'ssg';
project.favicon = '/favicon-96x96.png';
project.disallow = [];
project.icons = JSON.parse(`{{NULLSTACK_PROJECT_ICONS}}`);

export function generateBase() {
  const port = project.domain === 'localhost' ? `:${server.port}` : '';
  return `${worker.protocol}://${project.domain}${port}`;
}

export default project;