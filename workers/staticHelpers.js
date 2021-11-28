function withAPI(url) {
  let [path, query] = url.split('?');
  if (path.includes('.')) return url;
  path += '/index.json';
  return query ? [url, `${path}?${query}`] : [url, path];
}

async function extractData(response) {
  const html = await response.clone().text();
  const instancesLookup = 'window.instances = ';
  const instances = html.split("\n").find((line) => line.indexOf(instancesLookup) > -1).split(instancesLookup)[1].slice(0, -1);
  const pageLookup = 'window.page = ';
  const page = html.split("\n").find((line) => line.indexOf(pageLookup) > -1).split(pageLookup)[1].slice(0, -1);
  const json = `{"instances": ${instances}, "page": ${page}}`;
  return new Response(json, {
    headers: { 'Content-Type': 'application/json' }
  });
}