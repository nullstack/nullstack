export function sanitizeHtml(unsafe) {
  return unsafe
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function sanitizeString(unsafe) {
  return unsafe.replace(/<\//g, `<\\\/`)
}