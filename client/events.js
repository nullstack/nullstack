import router from './router'

export const eventCallbacks = new WeakMap()
export const eventSubjects = new WeakMap()

function executeEvent(callback, subject, event) {
  if (typeof callback === 'object') {
    Object.assign(subject.source, callback);
  } else {
    callback({ ...subject, event });
  }
}

export function generateCallback(selector, name) {
  return function eventCallback(event) {
    const subject = eventSubjects.get(selector)
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
    if (subject.href) {
      if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        router.url = subject.href
      }
    } else if (subject.default !== true) {
      event.preventDefault();
    }
    if (subject[name] === true) return
    if (Array.isArray(subject[name])) {
      for (const subcallback of subject[name]) {
        executeEvent(subcallback, subject, event)
      }
    } else {
      executeEvent(subject[name], subject, event)
    }
  }
};