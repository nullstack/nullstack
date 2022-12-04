export default function extractParamValue(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  return value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''
}
