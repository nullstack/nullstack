function serialize(object) {
  return JSON.stringify(object);
}

function head(metadata) {
  return (`
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      ${metadata.title ? `<title>${metadata.title}</title>` : ''}
      ${metadata.image ? `<meta property="og:image" content="${metadata.image}">` : ''}
      ${metadata.description ? `<meta property="og:description" content="${metadata.description}">` : ''}
      ${metadata.description ? `<meta name="description" content="${metadata.description}">` : ''}
      ${metadata.title ? `<meta property="og:title" content="${metadata.title}">` : ''}
      ${metadata.type ? `<meta property="og:type" content="${metadata.type}">` : ''}
      ${metadata.project ? `<meta property="og:site_name" content="${metadata.project}">` : ''}
      ${metadata.canonical ? `<meta property="og:url" content="${metadata.canonical}">` : ''}
      ${metadata.canonical ? `<link rel="canonical" href="${metadata.canonical}">` : ''}
      ${metadata.locale ? `<meta property="og:locale" content="${metadata.locale}">` : ''}
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <link rel="manifest" href="/manifest.json" integrity="">
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-capable" content="yes">
      ${metadata.project ? `<meta name="application-name" content="${metadata.project}">` : ''}
      ${metadata.project ? `<meta name="apple-mobile-web-app-title" content="${metadata.project}">` : ''}
      ${metadata.robots ? `<meta name="robots" content="${metadata.robots}" />` : ''}
      <meta name="msapplication-starturl" content="/">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <link rel="stylesheet" href="/client.css" integrity="">
      ${metadata.schema ? `<script type="application/ld+json">${serialize(metadata.schema)}</script>` : ''}
    </head>
  `).split('\n').join('');
}

function body({html, memory, representation, context, metadata, environment}) {
  const serializableContext = {};
  const blacklist = ['scope', 'router', 'metadata', 'environment'];
  for(const [key, value] of Object.entries(context)) {
    if(!blacklist.includes(key) && typeof(value) !== 'function') {
      serializableContext[key] = value;
    }
  }
  return (`
    <body>
      <div id="application">${html}</div>
      <script async defer>
        window.metadata = ${serialize(metadata)};
        window.context = ${serialize(serializableContext)};
        window.instances = ${serialize(memory)};
        window.representation = ${serialize(representation)};
        window.environment = ${serialize(environment)};
        document.addEventListener('DOMContentLoaded', () => {
          const script = window.document.createElement( 'script' );
          script.src = '/client.js';
          document.body.append(script);
        });
      </script>
    </body>
  `);
}

export default function(renderable) {
  return (`
    <!DOCTYPE html>
    <html${renderable.context.metadata.locale ? ` lang="${renderable.context.metadata.locale}"` : ''}>
      ${head(renderable.context.metadata)}
      ${body(renderable)}
    </html>
  `)
}