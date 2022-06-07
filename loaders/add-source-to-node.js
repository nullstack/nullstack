module.exports = function (source) {
  let tags = source.split('<');
  return tags.map((tag) => {
    match = tag.match(/\ on([a-z]*?)\=\{(.*?)\}/);
    if (match && tag.indexOf('source={') === -1) {
      return tag.substring(0, match.index) + ' source={this}' + tag.substring(match.index);
    }
    return tag;
  }).join('<');
}