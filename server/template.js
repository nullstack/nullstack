import files from './files';
import environment from './environment';
import project from './project';
import settings from './settings';
import integrities from './integrities';
import { absolute, cdn, cdnOrAbsolute } from './links';
import { sanitizeString } from '../shared/sanitizeString';

export default function ({ head, body, context, instances }) {
  const { page, router, worker, params } = context;
  const canonical = absolute(page.canonical || router.url);
  const image = cdnOrAbsolute(page.image);
  const serializableContext = {};
  const blacklist = ['scope', 'router', 'page', 'environment', 'settings', 'worker', 'params', 'project', 'instances'];
  for (const [key, value] of Object.entries(context)) {
    if (!blacklist.includes(key) && typeof (value) !== 'function') {
      serializableContext[key] = value;
    }
  }
  const serializableInstances = {};
  for (const [key, value] of Object.entries(instances)) {
    if (Object.keys(value).length) {
      serializableInstances[key] = value;
    }
  }
  return (`<!DOCTYPE html>
<html${page.locale ? ` lang="${page.locale}"` : ''}>
  <head>
    <meta charset="utf-8">
    <meta name="generator" content="Created with Nullstack - https://nullstack.app" />
    ${page.title ? `<title>${page.title}</title>` : ''}
    <meta property="og:image" content="${image}">
    ${page.description ? `<meta property="og:description" content="${page.description}">` : ''}
    ${page.description ? `<meta name="description" content="${page.description}">` : ''}
    ${page.title ? `<meta property="og:title" content="${page.title}">` : ''}
    ${project.type ? `<meta property="og:type" content="${project.type}">` : ''}
    ${project.name ? `<meta property="og:site_name" content="${project.name}">` : ''}
    <meta property="og:url" content="${canonical}">
    <link rel="canonical" href="${canonical}">
    ${page.locale ? `<meta property="og:locale" content="${page.locale}">` : ''}
    <link rel="shortcut icon" href="${cdn(project.favicon)}" type="image/png">
    <link rel="icon" href="${cdn(project.favicon)}" type="image/png">
    <link rel="manifest" href="/manifest.json" integrity="${integrities['manifest.json'] || ''}">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    ${project.name ? `<meta name="application-name" content="${project.name}">` : ''}
    ${project.name ? `<meta name="apple-mobile-web-app-title" content="${project.name}">` : ''}
    ${page.robots ? `<meta name="robots" content="${page.robots}" />` : ''}
    <meta name="msapplication-starturl" content="/">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="${cdn(`/nullstack/${environment.key}/client.css`)}" integrity="${integrities['client.css'] || ''}" crossorigin="anonymous">
    ${page.schema ? `<script type="application/ld+json">${JSON.stringify(page.schema)}</script>` : ''}
    ${project.icons['180'] ? `<link rel="apple-touch-icon" sizes="180x180" href="${cdn(project.icons['180'])}">` : ''}
    <meta name="msapplication-TileColor" content="${project.backgroundColor || project.color}">
    ${head.split('<!--#-->').join('')}
  </head>
  <body>
    ${environment.mode === 'spa' ? '<div id="application"></div>' : body}
    <script async>
      window.page = ${JSON.stringify(page)};
      window.instances = ${sanitizeString(JSON.stringify(environment.mode === 'spa' ? {} : serializableInstances))};
      window.environment = ${JSON.stringify(environment)};
      window.settings = ${JSON.stringify(settings)};
      window.worker = ${JSON.stringify(worker)};
      window.params = ${JSON.stringify(params)};
      window.project = ${JSON.stringify(project)};
      window.context = ${JSON.stringify(environment.mode === 'spa' ? {} : serializableContext)};
      document.addEventListener('DOMContentLoaded', () => {
        const script = window.document.createElement('script');
        script.src = '${cdn(`/nullstack/${environment.key}/client.js`)}';
        script.integrity = '${integrities['client.js'] || ''}';
        script.crossOrigin = 'anonymous';
        document.body.append(script);
      });
    </script>
  </body>
</html>`)
}