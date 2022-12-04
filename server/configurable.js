import { camelize } from '../shared/string'

export function createConfigurable(label) {
  const configurable = {}
  for (const key in process.env) {
    const lookup = `NULLSTACK_${label}_`
    if (key.startsWith(lookup)) {
      const camelCaseKey = camelize(key.substring(lookup.length))
      configurable[camelCaseKey] = process.env[key]
    }
  }
  return configurable
}
