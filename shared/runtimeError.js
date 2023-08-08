// Modified from: webpack-dev-server/client/overlay
// The error overlay is inspired (and mostly copied) by Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).
// styles are inspired by `react-error-overlay`
const msgStyles = {
  backgroundColor: 'rgba(206, 17, 38, 0.05)',
  color: '#fccfcf',
  padding: '1rem 1rem 1.5rem 1rem',
  marginBottom: '1rem'
}
const iframeStyle = {
  'z-index': 9999999999
}
const containerStyle = {
  position: 'fixed',
  inset: 0,
  fontSize: '1rem',
  padding: '2rem 2rem 1rem',
  whiteSpace: 'pre-wrap',
  overflow: 'auto',
  backgroundColor: '#111827',
  fontFamily: 'Roboto, Consolas, monospace',
  fontWeight: '600'
}
const headerStyle = {
  color: '#EF5350',
  fontSize: '2em',
  margin: '0 2rem 2rem 0'
}
const dismissButtonStyle = {
  color: '#ffffff',
  width: '2.5rem',
  fontSize: '1.7rem',
  margin: '1rem',
  cursor: 'pointer',
  position: 'absolute',
  right: 0,
  top: 0,
  backgroundColor: 'transparent',
  border: 'none',
  fontFamily: 'Menlo, Consolas, monospace'
}
const msgTypeStyle = {
  color: '#EF5350',
  fontSize: '1.1rem',
  marginBottom: '1rem',
  cursor: 'pointer'
}
const msgTextStyle = {
  lineHeight: '1.5',
  fontSize: '1rem',
  fontFamily: 'Menlo, Consolas, monospace',
  fontWeight: 'initial'
}

/**
 * @param {{ source: { fileName: string, lineNumber: string, columnNumber: string }, filenameWithLOC: string }} item
 * @returns {Promise<{ header: string, body: string}>}
 */
async function formatProblem(item) {
  const { file, relativePath } = await getFile(item.source)
  const message = `Undefined node at:\n${file}`
  const linkStyle = 'all:unset;margin-left:.3em;color:#F48FB1;font-size:14px;'
  const openEditor = `<a style="${linkStyle}">Open in Editor ></a>`
  const { lineNumber, columnNumber } = item.source
  return {
    header: `${relativePath}:${lineNumber}:${columnNumber} ${openEditor}`,
    body: message || ''
  }
}

function createOverlay() {
  /** @type {HTMLIFrameElement | null | undefined} */
  let overlayElement
  /** @type {HTMLDivElement | null | undefined} */
  let containerElement

  /**
   *
   * @param {HTMLElement} element
   * @param {CSSStyleDeclaration} style
   */
  function applyStyle(element, style) {
    Object.keys(style).forEach(function (prop) {
      element.style[prop] = style[prop]
    })
  }

  function createEl(elName, styles = {}, attributes = {}) {
    const el = document.createElement(elName)
    applyStyle(el, styles)
    Object.keys(attributes).forEach(key => {
      el[key] = attributes[key]
    })
    return el
  }

  function createContainer(onLoad) {
    overlayElement = createEl('div', iframeStyle, {
      id: 'nullstack-dev-server-client-overlay'
    })
    const contentElement = createEl('div', containerStyle, {
      id: 'nullstack-dev-server-client-overlay-div'
    })
    const headerElement = createEl('div', headerStyle, {
      innerText: 'Runtime errors:'
    })
    const closeButtonElement = createEl('button', dismissButtonStyle, {
      innerText: 'x',
      ariaLabel: 'Dismiss'
    })
    closeButtonElement.addEventListener('click', () => clear(true))
    containerElement = createEl('div')
    contentElement.append(headerElement, closeButtonElement, containerElement)

    overlayElement.appendChild(contentElement)
    onLoad(containerElement)
    document.body.appendChild(overlayElement)
  }

  /**
   * @param {(element: HTMLDivElement) => void} callback
   */
  function ensureOverlayExists(callback) {
    if (containerElement) {
      // Everything is ready, call the callback right away.
      callback(containerElement)
      return
    }
    if (overlayElement) {
      return
    }
    createContainer(callback)
  }

  // Successful compilation.
  /**
   * @param {boolean} force 
   */
  function clear(force) {
    const initializedClient = isClient() && initialized()
    if ((!initializedClient || !overlayElement) && !force) {
      return
    }

    // Clean up and reset internal state.
    document.body.removeChild(overlayElement)
    overlayElement = null
    containerElement = null
    storedErrors = []
  }

  // Compilation with errors (e.g. syntax error or missing modules).
  /**
   * @param {{ source: object, filenameWithLOC: string }} messageData
   */
  async function show(messageData) {
    const { header, body } = await formatProblem(messageData)
    ensureOverlayExists(function () {
      const typeElement = createEl('div', msgTypeStyle, {
        innerHTML: header
      })
      typeElement.addEventListener('click', function () {
        const query = new URLSearchParams({
          fileName: messageData.filenameWithLOC
        })
        fetch(`/nullstack-dev-server/open-editor?${query}`)
      })

      const entryElement = createEl('div', msgStyles)
      const messageTextNode = createEl('div', msgTextStyle, {
        innerText: body
      })
      entryElement.append(typeElement, messageTextNode)

      containerElement.appendChild(entryElement)
    })
  }
  return { show, clear }
}

const overlay = createOverlay()
let storedErrors = []
let initialRenders = 0

/**
 * @param {{ fileName: string, lineNumber: string, columnNumber: string }} source 
 * @param {{ disableProductionThrow: boolean, node: object }} options
 */
async function add(source, options) {
  ++initialRenders
  if (!isClient()) return throwUndefinedProd(options)
  if (!source) return throwUndefinedMain(options)

  const { fileName, lineNumber, columnNumber } = source
  const filenameWithLOC = `${fileName}:${lineNumber}:${columnNumber}`
  if (storedErrors.includes(filenameWithLOC)) return
  storedErrors.push(filenameWithLOC)
  await overlay.show({
    source,
    filenameWithLOC
  })
}

/**
 * @param {{ fileName: string, lineNumber: string, columnNumber: string }} source 
 */
async function getFile(source) {
  const query = new URLSearchParams(source)
  return (await fetch(`/nullstack-dev-server/get-file?${query}`)).json()
}

function isClient() {
  return typeof window !== 'undefined' && window?.document
}

function initialized() {
  return initialRenders > 2
}

/**
 * @param {{ disableProductionThrow: boolean }} options
 */
function throwUndefinedProd(options) {
  if (options.disableProductionThrow) return
  throw new Error(`
 🚨 An undefined node exist on your application!
 🚨 Access this route on development mode to get the location!`)
}

/**
 * @param {{ node: object | undefined }} options
 */
function throwUndefinedMain(options) {
  if (options.node !== undefined) return
  throw new Error('Your main component is trying to render an undefined node!')
}

module.exports = {
  add,
  clear: overlay.clear,
}