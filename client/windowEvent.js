let timer = null;

export default function windowEvent(name) {
  clearTimeout(timer);
  setTimeout(() => {
    const event = new Event('nullstack.' + name);
    window.dispatchEvent(event);
  }, 0);
}