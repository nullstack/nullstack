/* eslint-disable no-continue */
import generateTruthyString from '../shared/generateTruthyString'

export default function renderAttributes(attributes) {
  let element = ''
  for (const name in attributes) {
    if (name === 'debounce') continue
    if (!name.startsWith('on') && name !== 'html') {
      let attribute = attributes[name]
      if ((name === 'class' || name === 'style') && Array.isArray(attributes[name])) {
        attribute = generateTruthyString(attributes[name])
      } else {
        attribute = attributes[name]
      }
      const type = typeof attribute
      if (type !== 'object' && type !== 'function') {
        if (name !== 'value' && attribute === true) {
          element += ` ${name}`
        } else if (name === 'value' || (attribute !== false && attribute !== null && attribute !== undefined)) {
          element += ` ${name}="${attribute}"`
        }
      }
    }
  }
  return element
}
