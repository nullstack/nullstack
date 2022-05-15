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
    if (subject.default !== true) {
      event.preventDefault();
    }
    if (Array.isArray(subject[name])) {
      for (const subcallback of subject[name]) {
        executeEvent(subcallback, subject, event)
      }
    } else {
      executeEvent(subject[name], subject, event)
    }
  }
};