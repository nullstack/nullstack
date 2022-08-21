import router from './router'
import { camelize } from '../shared/string';
import noop from '../shared/noop'

export const eventCallbacks = new WeakMap()
export const eventSubjects = new WeakMap()
export const eventDebouncer = new WeakMap()

function executeEvent(callback, subject, event, data) {
  if (typeof callback === 'object') {
    Object.assign(subject.source, callback);
  } else {
    callback({ ...subject, event, data });
  }
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
  return function eventCallback(event) {
    const subject = eventSubjects.get(selector)
    if (!subject) return
    if (subject.href) {
      if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        router.url = subject.href
      }
    } else if (subject.default !== true) {
      event.preventDefault();
    }
    debounce(selector, name, subject.debounce, () => {
      const data = { ...subject.data }
      for (const attribute in subject) {
        if (attribute.startsWith('data-')) {
          const key = camelize(attribute.slice(5));
          data[key] = subject[attribute];
        }
      }
      if (subject?.bind !== undefined) {
        const valueName = (subject.type === 'checkbox' || subject.type === 'radio') ? 'checked' : 'value'
        const object = subject.bind.object
        const property = subject.bind.property
        if (valueName === 'checked') {
          object[property] = event.target[valueName];
        } else if (object[property] === true || object[property] === false) {
          object[property] = event.target[valueName] === 'true';
        } else if (typeof object[property] === 'number') {
          object[property] = +event.target[valueName] || 0;
        } else {
          object[property] = event.target[valueName];
        }
      }
      if (subject[name] === noop) return
      if (Array.isArray(subject[name])) {
        for (const subcallback of subject[name]) {
          executeEvent(subcallback, subject, event, data)
        }
      } else {
        executeEvent(subject[name], subject, event, data)
      }
    })
  }
};