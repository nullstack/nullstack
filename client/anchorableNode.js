import router from './router'

export function anchorableElement(element) {
  const links = element.querySelectorAll('a[href^="/"]:not([target])')
  for (const link of links) {
    link.onclick = (event) => {
      if (event.ctrlKey || event.shiftKey) return
      event.preventDefault()
      router.url = link.getAttribute('href')
    }
  }
}