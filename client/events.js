export const eventCallbacks = new WeakMap()
export const eventSubjects = new WeakMap()

export function generateCallback(selector, name) {
  return function eventCallback(event) {
    const subject = eventSubjects.get(selector)
    if (subject.default !== true) {
      event.preventDefault();
    }
    if (Array.isArray(subject[name])) {
      for (const subcallback of subject[name]) {
        subcallback({ ...subject, event });
      }
    } else {
      subject[name]({ ...subject, event });
    }
  }
};