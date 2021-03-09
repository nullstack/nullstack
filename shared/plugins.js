import { serverPlugins, clientPlugins } from '../plugins';

function genPlugins(scope, isClient, userPlugins = []) {
  return [
    ...(isClient ? clientPlugins : serverPlugins),
    ...userPlugins
  ].map(p => new p({ scope }));
}

function use(userPlugins) {
  return async (...plugins) => {
    plugins.flat().forEach(plugin => {
      if (!userPlugins.includes(plugin)) {
        userPlugins.push(plugin);
      }
    });
  }
}

export default { genPlugins, use };