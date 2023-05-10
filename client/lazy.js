import client from './client'

const queue = {}
let next = null

async function preload() {
  cancelIdleCallback(next)
  let entry = Object.entries(queue)[0]
  if (!entry) return
  let loader = entry[1]
  if (!loader) return
  await loader.load()
  next = requestIdleCallback(preload)
}

window.addEventListener('blur', () => {
  preload()
})

window.addEventListener('focus', () => {
  cancelIdleCallback(next)
})

export default function lazy(hash, importer) {
  const loader = {
    load: async () => {
      const mod = await importer()
      loader.component = mod.default
      delete queue[hash]
      client.update()
    },
    component: null,
    __nullstack_lazy: true
  }
  queue[hash] = loader
  return loader
}