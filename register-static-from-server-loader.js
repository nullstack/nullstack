const crypto = require('crypto');

module.exports = function(source) {
  if(source.indexOf('extends Nullstack') == -1) {
    return source;
  }
  const hash = crypto.createHash('md5').update(source).digest("hex");
  const fragments = source.split('class ').filter((code) => code.indexOf('extends Nullstack') > -1 && code.indexOf('static async') > -1);
  for(const fragment of fragments) {
    const klassName = (fragment.split(' ')[0] || '').trim();
    const subfragments = fragment.split('static ').filter((code) => code.startsWith('async'));
    for(const subfragment of subfragments) {
      const methodName = (subfragment.split('(')[0] || '').replace('async', '').trim();
      if(methodName !== 'start') {
        source += `\nNullstack.registry["${hash}.${methodName}"] = ${klassName}.${methodName};`
      }
    }
  }
  return source;
}