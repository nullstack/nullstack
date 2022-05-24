export default function generateProps(context, target) {
  const delta = {}
  for (const key in target) {
    if (key === 'data') continue
    if (key === 'self') continue
    if (key === 'children') continue
    if (key[0] === '_') continue
    if (context[key] !== target[key]) {
      delta[key] = target[key]
    }
  }
  return delta
}
