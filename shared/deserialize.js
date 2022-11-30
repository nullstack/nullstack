const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/

function dateParser(key, value) {
  if (typeof value === 'string') {
    let a = reISO.exec(value)
    if (a) return new Date(value)
    a = reMsAjax.exec(value)
    if (a) {
      const b = a[1].split(/[-+,.]/)
      return new Date(b[0] ? +b[0] : 0 - +b[1])
    }
  }
  return value
}

export default function deserialize(string) {
  return JSON.parse(string, dateParser)
}
