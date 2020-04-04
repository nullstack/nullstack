module.exports = function(source) {
  if(source.indexOf('extends Nullstack') == -1) {
    return source;
  }
  const methodNames = {};
  const fragments = source.split(' ').filter((code) => code.indexOf('render') > -1 && code.indexOf('(') > -1 && code.indexOf('this.') == -1);
  for(const fragment of fragments) {
    const methodName = fragment.split('(')[0].replace('render', '');
    if(methodName !== '') {
      const returnIndexes = [];
      for(const matcher of [...source.matchAll(`<${methodName}`)]) {
        limit = source.substring(0, matcher.index);
        const submatchers = [...limit.matchAll(`return`)];
        const lastReturnIndex = submatchers[submatchers.length - 1].index;
        if(!returnIndexes.includes(lastReturnIndex)) {
          returnIndexes.push(lastReturnIndex);
        }
      }
      methodNames[methodName] = returnIndexes;
    }
  }
  modifiedSource = '';
  lastIndex = 0;
  for(const methodName in methodNames) {
    for(const index of methodNames[methodName]) {
      modifiedSource += source.substring(lastIndex, index - 1);
      modifiedSource += ` const ${methodName} = this.render${methodName};\n    `;
      lastIndex = index;
    }
  }
  modifiedSource += source.substring(lastIndex, source.length - 1);
  return modifiedSource;
}