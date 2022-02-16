import router from './router'

export function anchorableElement(element) {
  const links = element.querySelectorAll('a[href^="/"]:not([target])')
  for (const link of links) {
    if (link.dataset.nullstack) return
    link.dataset.nullstack = true
    link.addEventListener('click', (event) => {
      if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault()
        router.url = link.getAttribute('href')
      }
    })
  }
}