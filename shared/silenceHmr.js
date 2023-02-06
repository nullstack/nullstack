export default function dangerouslySilenceHmr() {
  if (!module.hot) return false
  // kids, don't do this at home without the supervision of an adult
  // i'm shamefully doing this because i couldn't silence css notifications
  // at least not without spending all my free time reading documentation
  // (╯°□°）╯︵ ┻━┻
  const originalLog = console.log
  global.console.log = function (...args) {
    if (args[0].toString().startsWith('[nodemon-webpack-plugin]')) return
    if (args[0].toString().startsWith('[HMR]')) return
    originalLog(...args)
  }
}
