const seed = Object.freeze([])

export default function generateTruthyString(elements) {
  return seed
    .concat(...elements)
    .filter(Boolean)
    .join(' ')
}
