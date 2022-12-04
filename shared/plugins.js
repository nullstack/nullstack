import anchorable from '../plugins/anchorable'
import bindable from '../plugins/bindable'
import parameterizable from '../plugins/parameterizable'
import routable from '../plugins/routable'

const plugins = [parameterizable, anchorable, routable, bindable]

export function transformNodes(scope, node, depth) {
  for (const plugin of plugins) {
    plugin.transform({ ...scope.context, node, depth })
  }
}

export function loadPlugins(scope) {
  for (const plugin of plugins) {
    plugin.load && plugin.load(scope.context)
  }
  return plugins
}

export function useClientPlugins(plugin) {
  if (plugin.client) plugins.push(plugin)
}

export function useServerPlugins(plugin) {
  if (plugin.server) plugins.push(plugin)
}
