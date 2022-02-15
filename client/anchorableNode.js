import router from './router'

export function anchorableElement(element) {
  const links = element.querySelectorAll('a[href^="/"]:not([target])')
  if (element.dataset.nullstack) return
  element.dataset.nullstack = true
  for (const link of links) {
    link.addEventListener('click', (event) => {
      if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault()
        router.url = link.getAttribute('href')
      }
    })
  }
}