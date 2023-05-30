// deprecate project.type
// deprecate project.viewport
// deprecate page.schema

export default function Head({ router, project, page }) {
  const image = page.image
  const canonical = page.canonical || router.url
  const favicon = project.favicon // cdn
  return (
    <html lang={page.locale}>
      <head>
        <title>{page.title} - {project.title}</title>
        <meta name="description" content={page.description} />
        <link rel="icon" href={favicon} type="image/png" />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content={page.robots} />

        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content={project.name} />
        <meta property="og:locale" content={page.locale} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />

        <meta name="application-name" content={project.name} />
        <link rel="shortcut icon" href={favicon} type="image/png" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="apple-mobile-web-app-title" content={project.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href={cdn(project.icons['180'])} />

        <meta name="msapplication-starturl" content="/" />
        <meta name="msapplication-TileColor" content={project.backgroundColor || project.color} />

        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
    </html>
  )
}