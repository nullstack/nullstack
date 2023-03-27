
const clocks = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']

function logger(bundle, mode) {
  let cindex = 0
  let timer = null
  let stoped = false

  function dots() {
    return Array((cindex % 3) + 1).fill('.').join('')
  }

  function reset() {
    if (process.stdout.clearLine) {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
    }
  }

  function start() {
    reset()
    if (cindex >= clocks.length) {
      cindex = 0
    }
    let symbol = clocks[cindex]
    process.stdout.write(` ${symbol}  Building your ${bundle} in ${mode} mode ${dots()}`)
    cindex++;
    timer = setTimeout(start, 200)
  }
  start()

  function stop() {
    if (stoped) return
    clearTimeout(timer)
    reset()
    process.stdout.write(` ✅  Starting your ${bundle} in ${mode} mode\n`)
    stoped = true
  }

  return { stop }
}

module.exports = logger