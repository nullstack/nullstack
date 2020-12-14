function toAPI(url) {
  let [path, query] = url.split('?');
  if(path.indexOf('.') === -1) {
    path += '/index.json';
  }
  return query ? `${path}?${query}` : path;
}

async function extractData(response) {
  const html = await response.clone().text();
  const instancesLookup = 'window.instances = ';
  const instances = html.split("\n").find((line) => line.indexOf(instancesLookup) > -1).split(instancesLookup)[1].slice(0, -1);
  const pageLookup = 'window.page = ';
  const page = html.split("\n").find((line) => line.indexOf(pageLookup) > -1).split(pageLookup)[1].slice(0, -1);
  const json = `{"instances": ${instances}, "page": ${page}}`;
  return new Response(json, {
    headers: {'Content-Type': 'application/json'}
  })
}

async function injectData(templateResponse, cachedDataResponse) {
  const data = await cachedDataResponse.json();
  const input = await templateResponse.text();
  const output = input.split(`\n`).map((line) => {
    if(line.indexOf('window.instances = ') > -1) {
      return `window.instances = ${JSON.stringify(data.instances)};`
    } else if(line.indexOf('window.page = ') > -1) {
      return `window.page = ${JSON.stringify(data.page)};`
    } else if(line.indexOf('window.worker = ') > -1) {
      return line.replace('"online":false', '"online":true');
    }
    return line;
  }).join("\n");
  return new Response(output, {
    headers: {'Content-Type': 'text/html'}
  });
}