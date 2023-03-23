import LazyComponent from "../shared/lazyComponent"

let next = null
const queue = []

async function preload() {
  let importer = queue.pop()
  await importer()
  requestIdleCallback(preload)
}

export default function lazy(_hash, importer) {
  queue.push(importer)
  cancelIdleCallback(next)
  preload()
  return class extends LazyComponent {
    importer = importer
  }
}