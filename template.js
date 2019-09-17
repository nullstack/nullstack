export default function(page, settings, state, request) {
  const stringify = (object) => {
    return JSON.stringify(object);
  }
  const url = `${settings.protocol}://${settings.domain}${request.path}`;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${settings.title}</title>
      <meta property="og:image" content="${settings.image}">
      <meta property="og:description" content="${settings.description}">
      <meta name="description" content="${settings.description}">
      <meta property="og:title" content="${settings.title}">
      <meta property="og:type" content="${settings.type}">
      <meta property="og:site_name" content="${settings.project}">
      <meta property="og:url" content="${settings.canonical || url}">
      <link rel="canonical" href="${settings.canonical || url}">
      <meta property="og:locale" content="${settings.locale}">
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <link rel="manifest" href="/manifest.json" integrity="">
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="application-name" content="${settings.project}">
      <meta name="apple-mobile-web-app-title" content="${settings.project}">
      ${settings.robots ? `<meta name="robots" content="${settings.robots}" />` : ''}
      <meta name="msapplication-starturl" content="/">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <link rel="stylesheet" href="/client.css" integrity="">
    </head>
    <body>
      <div id="application">${page}</div>
      <script async defer>
        window.initialState = ${stringify(state)};
        window.initialSettings = ${stringify(settings)};
        document.addEventListener('DOMContentLoaded', () => {
          const script = window.document.createElement( 'script' );
          script.src = '/client.js';
          document.body.append(script);
        });
      </script>
    </body>
    </html>
  `
}
