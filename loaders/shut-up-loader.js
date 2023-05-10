module.exports = function removeStaticFromClient(source) {
  const injection = `
    const console = {
      log: () => {},
      error: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {}
    };
  `
  return injection + source
}
