function match(serializedMatcher, url) {
  const matcher = JSON.parse(serializedMatcher);
  return new RegExp(matcher.source, matcher.flags).test(url.href)
}