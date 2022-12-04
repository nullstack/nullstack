export default function serializeSearch(params) {
  const keys = Object.keys(params)
  return keys
    .map((key) => {
      if (params[key] === false || !!params[key]) {
        return `${key}=${params[key]}`
      }
      return ''
    })
    .filter((segment) => !!segment)
    .join('&')
}
