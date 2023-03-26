const queue = {}

export default function lazy(hash, importer) {
  queue[hash] = importer
}

export async function load(hash) {
  const fileHash = module.hot ? hash.split('___')[0] : hash.slice(0, 8)
  if (!queue[fileHash]) return
  const importer = queue[fileHash]
  await importer()
  delete queue[fileHash]
}