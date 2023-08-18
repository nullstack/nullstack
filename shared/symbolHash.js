export function symbolHashSplit(hash) {
  return hash.split('---')
}

export function symbolHashJoin(hash, joinHash) {
  return `${hash}---${joinHash}`
}