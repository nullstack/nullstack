import noop from '../shared/noop'
import { camelize } from '../shared/string'
import router from './router'

export const eventCallbacks = new WeakMap()
export const eventSubjects = new WeakMap()
export const eventDebouncer = new WeakMap()

export function generateSubject(selector, attributes, name) {
  if (Array.isArray(attributes[name])) {
    for (let i = 0; i < attributes[name].length; i++) {
      if (typeof attributes[name][i] === 'object') {
        let changeset = attributes[name][i]
        attributes[name][i] = () => Object.assign(attributes.source, changeset)
      }
    }
  } else if (typeof attributes[name] === 'object') {
    let changeset = attributes[name]
    attributes[name] = () => Object.assign(attributes.source, changeset)
  }
  eventSubjects.set(selector, attributes)
}

function debounce(selector, name, time, callback) {
  if (!time) {
    callback()
  } else {
    const eventMap = eventDebouncer.get(selector) || {}
    clearTimeout(eventMap[name])
    eventMap[name] = setTimeout(callback, time)
    eventDebouncer.set(selector, eventMap)
  }
}

export function generateCallback(selector, name) {
  let eventNames = eventCallbacks.get(selector)
  if (!eventNames) {
    eventNames = {}
    eventCallbacks.set(selector, eventNames)
  }
  const callback = function eventCallback(event) {
    const subject = eventSubjects.get(selector)
    if (!subject) return
    if (subject.href) {
      if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        router.url = subject.href
      }
    } else if (subject.default !== true) {
      event.preventDefault()
    }
    debounce(selector, name, subject.debounce, () => {
      const data = { ...subject.data }
      for (const attribute in subject) {
        if (attribute.startsWith('data-')) {
          const key = camelize(attribute.slice(5))
          data[key] = subject[attribute]
        }
      }
      if (subject?.bind !== undefined) {
        const valueName = subject.type === 'checkbox' || subject.type === 'radio' ? 'checked' : 'value'
        const object = subject.bind.object
        const property = subject.bind.property
        if (valueName === 'checked') {
          object[property] = event.target[valueName]
        } else if (object[property] === true || object[property] === false) {
          object[property] = event.target[valueName] === 'true'
        } else if (typeof object[property] === 'number') {
          object[property] = +event.target[valueName] || 0
        } else {
          object[property] = event.target[valueName]
        }
      }
      if (subject[name] === noop) return
      if (Array.isArray(subject[name])) {
        for (const subcallback of subject[name]) {
          subcallback({ ...subject, event, data })
        }
      } else {
        subject[name]({ ...subject, event, data })
      }
    })
  }
  eventNames[name] = callback
  return callback
}
