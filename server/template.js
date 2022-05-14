import { sanitizeString } from '../shared/sanitizeString';
import environment from './environment';
import integrities from './integrities';
import { absolute, cdn, cdnOrAbsolute } from './links';
import project from './project';
import settings from './settings';

export default function ({ head, body, context, instances }) {
  const timestamp = environment.development ? `&timestamp=${+new Date()}` : ''
  const { page, router, worker, params } = context;
  const canonical = absolute(page.canonical || router.url);
  const image = cdnOrAbsolute(page.image);
  const serializableContext = {};
  const blacklist = ['scope', 'router', 'page', 'environment', 'settings', 'worker', 'params', 'project', 'instances'];
  for (const [key, value] of Object.entries(context)) {
    if (!blacklist.includes(key) && typeof value !== 'function') {
      serializableContext[key] = value;
    }
  }
  const serializableInstances = {};
  for (const [key, value] of Object.entries(instances)) {
    if (Object.keys(value).length) {
      serializableInstances[key] = value;
    }
  }
  const state = {
    page, environment, settings, worker, params, project,
    instances: environment.mode === 'spa' ? {} : serializableInstances,
    context: environment.mode === 'spa' ? {} : serializableContext
  };
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
    <link rel="manifest" href="/manifest.webmanifest" integrity="${integrities['manifest.webmanifest'] || ''}">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    ${project.name ? `<meta name="application-name" content="${project.name}">` : ''}
    ${project.name ? `<meta name="apple-mobile-web-app-title" content="${project.name}">` : ''}
    ${page.robots ? `<meta name="robots" content="${page.robots}" />` : ''}
    <meta name="msapplication-starturl" content="/">
    ${project.viewport ? `<meta name="viewport" content="${project.viewport}">` : ''}
    <link rel="stylesheet" href="${cdn(`/client.css?fingerprint=${environment.key}${timestamp}`)}" integrity="${integrities['client.css'] || ''}" crossorigin="anonymous">
    ${page.schema ? `<script type="application/ld+json">${JSON.stringify(page.schema)}</script>` : ''}
    ${project.icons['180'] ? `<link rel="apple-touch-icon" sizes="180x180" href="${cdn(project.icons['180'])}">` : ''}
    <meta name="msapplication-TileColor" content="${project.backgroundColor || project.color}">
    <meta name="nullstack" content="${encodeURIComponent(sanitizeString(JSON.stringify(state)))}">
    ${head.split('<!--#-->').join('')}
    <script src="${cdn(`/client.js?fingerprint=${environment.key}${timestamp}`)}" integrity="${integrities['client.js'] || ''}" defer crossorigin="anonymous"></script>
  </head>
  <body>
    ${environment.mode === 'spa' ? '<div id="application"></div>' : body}
  </body>
</html>`)
}