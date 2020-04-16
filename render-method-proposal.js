module.exports = function(source) {
  if(source.indexOf('extends Nullstack') == -1) {
    return source;
  }
  const indexes = {};
  const fragments = source.split(' ').filter((code) => code.indexOf('render') > -1 && code.indexOf('(') > -1 && code.indexOf('this.') == -1);
  for(const fragment of fragments) {
    const methodName = fragment.split('(')[0].replace('render', '');
    if(methodName !== '') {
      for(const matcher of [...source.matchAll(`<${methodName}`)]) {

        limit = source.substring(0, matcher.index);
        const submatchers = [...limit.matchAll(`return`)];
        const lastReturnIndex = submatchers[submatchers.length - 1].index;
        if(!indexes[lastReturnIndex]) {
          indexes[lastReturnIndex] = [];
        }
        if(!indexes[lastReturnIndex].includes(methodName)) {
          indexes[lastReturnIndex].push(methodName);
        }
      }
    }
  }
  lastIndex = 0;
  const sources = [];
  for(const index in indexes) {
    sources.push(source.substring(lastIndex, index - 1))
    lastIndex = index;
    for(const methodName of indexes[index]) {
      sources.push(` const ${methodName} = this.render${methodName};\n    `);
    }
  }
  sources.push(source.substring(lastIndex, source.length - 1));
  return sources.join('');
}