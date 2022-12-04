export default function (error) {
  const lines = error.stack.split(`\n`)
  let initiator = lines.find((line) => line.indexOf('Proxy') > -1)
  if (initiator) {
    initiator = initiator.split('(')[0]
    if (initiator) {
      initiator = initiator.trim()
      initiator = initiator.replace('at', '').trim()
    }
  }
  let source = lines.find((line) => line.indexOf('webpack:') > -1)
  if (source) {
    source = source.split('webpack:')[1]
    if (source) {
      source = source.split('\\').join('/')
    }
  }
  let file, line
  if (source) {
    const sourceAndLine = source.split(':')
    file = sourceAndLine[0]
    line = sourceAndLine[1]
    let className = file.split('/').find((segment) => segment.indexOf('.') > -1)
    if (className) {
      className = className.replace('.njs', '')
      if (initiator) {
        initiator = initiator.replace('Proxy', className)
      }
    }
  }
  console.info()
  console.info('\x1b[31m', error.name, '-', error.message, '\x1b[0m')
  console.info()
  if (initiator) {
    console.info('\x1b[2m', 'initiator:', '\x1b[0m', '\x1b[37m', initiator, '\x1b[0m')
  }
  if (file) {
    console.info('\x1b[2m', 'file:     ', '\x1b[0m', '\x1b[37m', file, '\x1b[0m')
  }
  if (line) {
    console.info('\x1b[2m', 'line:     ', '\x1b[0m', '\x1b[37m', line, '\x1b[0m')
  }
  console.info()
}
