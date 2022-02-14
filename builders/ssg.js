module.exports = async function ssg({ output, cache }) {
  const folder = output || 'ssg';
  process.env.NULLSTACK_ENVIRONMENT_MODE = 'ssg';

  const dir = process.cwd();
  const application = require(`${dir}/.production/server`).default;
  const { resolve } = require('path')
  const { existsSync, mkdirSync, writeFileSync, copySync, removeSync } = require('fs-extra');

  function path(file = '') {
    const target = file.startsWith('/') ? file.slice(1) : file;
    return resolve(`${dir}/${folder}`, target).split('?')[0]
  }

  const links = {};
  const pages = {};

  async function copyRoute(url = '/') {
    links[url] = true;
    if (url.indexOf('.') > -1) {
      return;
    }
    const content = await application.server.prerender(url);
    const target = path(url)

    console.log(` ⚙️  ${url}`)
    if (!existsSync(target)) {
      mkdirSync(target, { recursive: true });
    }
    writeFileSync(`${target}/index.html`, content)
    if (url !== '/') {
      writeFileSync(`${target}.html`, content)
    }

    const instancesLookup = 'window.instances = ';
    const instances = content.split("\n").find((line) => line.indexOf(instancesLookup) > -1).split(instancesLookup)[1].slice(0, -1);

    const pageLookup = 'window.page = ';
    const page = content.split("\n").find((line) => line.indexOf(pageLookup) > -1).split(pageLookup)[1].slice(0, -1);
    if (url !== `/nullstack/${application.environment.key}/offline` && url !== '/404') {
      pages[url] = JSON.parse(page);
    }

    const json = `{"instances": ${instances}, "page": ${page}}`;
    writeFileSync(`${target}/index.json`, json);

    const pattern = /href="(.*?)"/g;
    while (match = pattern.exec(content)) {
      const link = match[1].split('#')[0];
      if (link.startsWith('/')) {
        if (links[link] === undefined) {
          links[link] = false;
        }
      }
    }

    for (const link in links) {
      if (!links[link]) {
        await copyRoute(link)
      }
    }
  }

  async function copyBundle(url) {
    console.log(` ⚙️  ${url}`)
    const content = await application.server.prerender(url);
    const target = path(url)
    writeFileSync(target, content)
  }

  async function createSitemap() {
    console.log(' ⚙️  /sitemap.xml')
    const timestamp = new Date().toJSON().substring(0, 10);
    const urls = Object.keys(pages).map((path) => {
      const page = pages[path];
      const canonical = `https://${application.project.domain}${path}`;
      return `<url><loc>${canonical}</loc><lastmod>${timestamp}</lastmod>${page.changes ? `<changefreq>${page.changes}</changefreq>` : ''}${page.priority ? `<priority>${page.priority.toFixed(1)}</priority>` : ''}</url>`;
    });
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
    writeFileSync(`${path()}/sitemap.xml`, xml);
  }

  function filter(src, dest) {
    return dest.endsWith(folder) || (src.includes('client') && !src.includes('.txt'))
  }

  console.log()
  if (existsSync(path())) {
    removeSync(path());
  }
  mkdirSync(path())
  console.log(` ⚙️  /public/`)
  copySync(path(`../public`), path());
  console.log(` ⚙️  /.production/`)
  copySync(path(`../.production`), path(), { filter });
  await copyRoute()
  await copyRoute(`/nullstack/${application.environment.key}/offline`);
  await copyRoute(`/404`);
  await copyBundle(`/manifest.json`)
  await copyBundle(`/service-worker.js`)
  await copyBundle('/robots.txt')
  await createSitemap()
  console.log()

  console.log('\x1b[36m%s\x1b[0m', ` ✅️ ${application.project.name} is ready at ${folder}\n`);

  if (cache) {
    console.log('Storing cache...');
  } else {
    process.exit();
  }
}