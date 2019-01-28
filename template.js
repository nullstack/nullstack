export default function(page, settings, state) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${settings.project} - ${settings.title}</title>
      <meta property="og:image" content="${settings.image}">
      <meta property="og:description" content="${settings.description}">
      <meta name="description" content="${settings.description}">
      <meta property="og:title" content="${settings.title}">
      <meta property="og:type" content="${settings.type}">
      <meta property="og:site_name" content="${settings.project}">
      <meta property="og:url" content="${settings.protocol}://${settings.domain}${settings.path}">
      <link rel="canonical" href="${settings.protocol}://${settings.domain}${settings.path}">
      <meta property="og:locale" content="${settings.locale}">
      <link rel="manifest" href="/manifest.json" integrity="">
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="application-name" content="${settings.project}">
      <meta name="apple-mobile-web-app-title" content="${settings.project}">
      <meta name="msapplication-starturl" content="/">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <link rel="stylesheet" href="/client.css" integrity="">
    </head>
    <body>
      <div id="application" data-state='${JSON.stringify(state)}' data-settings='${JSON.stringify(settings)}'>${page}</div>
      <script src="/client.js" integrity=""></script>
    </body>
    </html>
  `
}
