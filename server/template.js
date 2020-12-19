import files from './files';
import environment from './environment';
import project from './project';
import settings from './settings';

function absolutefy(path) {
  if(path.indexOf('//') === -1) {
    return `https://${project.domain}${path}`;
  }
  return path;
}

export default function({head, body, context, instances}) {
  const {page, router, worker, params, project} = context;
  const canonical = absolutefy(page.canonical || router.url);
  const image = absolutefy(page.image);
  const serializableContext = {};
  const blacklist = ['scope', 'router', 'page', 'environment', 'loading', 'settings', 'worker', 'params', 'project'];
  for(const [key, value] of Object.entries(context)) {
    if(!blacklist.includes(key) && typeof(value) !== 'function') {
      serializableContext[key] = value;
    }
  }
  return (`<!DOCTYPE html>
<html${page.locale ? ` lang="${page.locale}"` : ''}>
  <head>
    <meta name="generator" content="Created with Nullstack - https://nullstack.app" />
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
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
    <link rel="shortcut icon" href="${project.favicon}" type="image/png">
    <link rel="icon" href="${project.favicon}" type="image/png">
    <link rel="manifest" href="/manifest-${environment.key}.json" integrity="">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    ${project.name ? `<meta name="application-name" content="${project.name}">` : ''}
    ${project.name ? `<meta name="apple-mobile-web-app-title" content="${project.name}">` : ''}
    ${page.robots ? `<meta name="robots" content="${page.robots}" />` : ''}
    <meta name="msapplication-starturl" content="/">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    ${files['client.css'] ? `<link rel="stylesheet" href="${project.cdn}/client-${environment.key}.css" integrity="">` : ''}
    ${page.schema ? `<script type="application/ld+json">${JSON.stringify(page.schema)}</script>` : ''}
    ${project.icons['180'] ? `<link rel="apple-touch-icon" sizes="180x180" href="${project.icons['180']}">` : ''}
    <meta name="msapplication-TileColor" content="${project.backgroundColor || project.color}">
    <meta name="theme-color" content="${project.color}">
    ${head.split('<!--#-->').join('')}
  </head>
  <body>
    <div id="application">${body}</div>
    <script async defer>
      window.page = ${JSON.stringify(page)};
      window.instances = ${JSON.stringify(instances)};
      window.environment = ${JSON.stringify(environment)};
      window.settings = ${JSON.stringify(settings)};
      window.worker = ${JSON.stringify(worker)};
      window.params = ${JSON.stringify(params)};
      window.project = ${JSON.stringify(project)};
      window.context = ${JSON.stringify(serializableContext)};
      document.addEventListener('DOMContentLoaded', () => {
        const script = window.document.createElement('script');
        script.src = '${project.cdn}/client-${environment.key}.js';
        document.body.append(script);
      });
    </script>
  </body>
</html>`)
}