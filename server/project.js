import environment from './environment';
import worker from './worker';
import reqres from './reqres';

const project = {};

project.domain = process.env['NULLSTACK_PROJECT_DOMAIN']
project.name = process.env['NULLSTACK_PROJECT_NAME']
project.shortName = process.env['NULLSTACK_PROJECT_SHORT_NAME']
project.color = process.env['NULLSTACK_PROJECT_COLOR']
project.viewport = process.env['NULLSTACK_PROJECT_VIEWPORT'] || 'width=device-width, initial-scale=1, shrink-to-fit=no';
project.type = 'website';
project.display = 'standalone';
project.orientation = 'portrait';
project.scope = '/';
project.root = '/';
project.sitemap = environment.mode === 'ssg';
project.favicon = '/favicon-96x96.png';
project.disallow = [];
project.icons = JSON.parse(`{{NULLSTACK_PROJECT_ICONS}}`);

function getHost() {
  if (reqres.request?.headers?.host) {
    return reqres.request.headers.host
  }
  if (project.domain === 'localhost') {
    return `localhost:${process.env['NULLSTACK_SERVER_PORT']}`
  }
  return project.domain
}

export function generateBase() {
  return `${worker.protocol}://${getHost()}`;
}

export default project;