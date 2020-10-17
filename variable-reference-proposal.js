module.exports = function(source) {
  let match;
  const pattern = /bind\=\{(.*?)\}/;
  while ((match = pattern.exec(source)) != null) {
    const [a, b] = match[1].split(/\.(?=[^\.]+$)/);
    source = source.replace(match[0], `source={${a}} bind="${b}"`);
  }
  return source;
}