import LazyComponent from "../shared/lazyComponent"

const queue = {}

export default function lazy(hash, importer) {
  queue[hash] = importer
  return class extends LazyComponent {
    importer = importer
  }
}

export async function load(hash) {
  const fileHash = module.hot ? hash.split('___')[0] : hash.slice(0, 8)
  if (!queue[fileHash]) return
  const importer = queue[fileHash]
  delete queue[fileHash]
  return importer()
}