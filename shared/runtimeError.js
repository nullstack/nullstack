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
  marginRight: '1rem'
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
const explanationStyle = {
  fontSize: '12px',
  fontWeight: 'lighter',
  color: '#d19aac',
  margin: '1rem 0'
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

import { throwUndefinedNodeProd } from './generateTree'

/**
 * @param {{ source: { fileName: string, lineNumber: string, columnNumber: string }, filenameWithLOC: string }} item
 * @returns {Promise<{ header: string, body: string}>}
 */
async function formatProblem(item) {
  const { file, relativePath } = await getFile(item.source)
  const linkStyle = 'all:unset;margin-left:.3em;color:#F48FB1;font-size:14px;'
  const openEditor = `<a style="${linkStyle}">Open in Editor ></a>`
  const { lineNumber, columnNumber } = item.source
  const relativeLOC = `${relativePath}:${lineNumber}:${columnNumber}`
  console.error(
    `Error: Attempting to render an undefined node at\n%O`,
    relativeLOC
  )
  return {
    header: `${relativeLOC} ${openEditor}`,
    body: file || ''
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
      innerText: 'Undefined nodes found:'
    })
    const closeButtonElement = createEl('button', dismissButtonStyle, {
      innerText: 'x',
      ariaLabel: 'Dismiss'
    })
    const explanationElement = createEl('p', explanationStyle, {
      innerText: 'Tip: This error means a missing return statement around JSX, returning undefined from a renderable function, a missing component import or a typo on it\'s tag name.'
    })
    closeButtonElement.addEventListener('click', () => clear(true))
    containerElement = createEl('div')
    contentElement.append(
      headerElement,
      closeButtonElement,
      explanationElement,
      containerElement
    )

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

function throwUndefinedMain() {
  throw new Error('Your main component is trying to render an undefined node!')
}

const overlay = createOverlay()
let storedErrors = []
let initialRenders = 0

/**
 * @param {{ fileName: string, lineNumber: string, columnNumber: string }} source 
 * @param {{ node?: object }} options
 */
export async function add(source, options) {
  ++initialRenders
  if (options?.node !== undefined) return
  if (!isClient()) return throwUndefinedNodeProd(options)
  if (!source) return throwUndefinedMain()

  const { fileName, lineNumber, columnNumber } = source
  const filenameWithLOC = `${fileName}:${lineNumber}:${columnNumber}`
  if (storedErrors.includes(filenameWithLOC)) return
  storedErrors.push(filenameWithLOC)
  await overlay.show({
    source,
    filenameWithLOC
  })
}

export const clear = overlay.clear
