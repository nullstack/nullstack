module.exports = function(source) {
  let match;
  const pattern = /bind\=\{(.*?)\}/;
  while ((match = pattern.exec(source)) != null) {
    const [a, b] = match[1].split(/\.(?=[^\.]+$)/);
    source = source.replace(match[0], `source={${a}} bind="${b}"`);
  }
  const tags = source.split('<');
  source = tags.map((tag) => {
    match = tag.match(/\ on([a-z]*?)\=\{(.*?)\}/);
    if(match && tag.indexOf('source={') == -1) {
      return tag.substring(0, match.index) + ' source={this}' + tag.substring(match.index);
    }
    return tag;
  }).join('<');
  return source;
}