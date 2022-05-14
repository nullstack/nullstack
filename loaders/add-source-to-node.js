module.exports = function (source) {
  let match;
  let tags = source.split('<');
  source = tags.map((tag) => {
    match = tag.match(/bind\=\{(.*?)\}/);
    if (match && tag.indexOf('source={') === -1) {
      let [a, b] = match[1].split(/\.(?=[^\.]+$)/);
      if (!b) {
        b = a;
        a = '';
      }
      if (b.indexOf('[') > -1) {
        const [ref, index] = b.split('[');
        if (a) {
          a = [a, ref].join('.');
        } else {
          a = ref;
        }
        b = '{' + index.replace(']', '}');
      } else {
        b = `"${b}"`;
      }
      return tag.replace(match[0], `source={${a}} bind=${b}`);
    }
    return tag;
  }).join('<');
  tags = source.split('<');
  source = tags.map((tag) => {
    match = tag.match(/\ on([a-z]*?)\=\{(.*?)\}/);
    if (match && tag.indexOf('source={') === -1) {
      return tag.substring(0, match.index) + ' source={this}' + tag.substring(match.index);
    }
    return tag;
  }).join('<');
  return source;
}