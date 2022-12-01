module.exports = function (source) {
  const tags = source.split('<')
  return tags
    .map((tag) => {
      const match = tag.match(/ on([a-z]*?)=\{(.*?)\}/)
      if (match && tag.indexOf('source={') === -1) {
        return `${tag.substring(0, match.index)} source={this}${tag.substring(match.index)}`
      }
      return tag
    })
    .join('<')
}
