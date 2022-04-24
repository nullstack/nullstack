import worker from './worker'

let shouldReloadNext = false;
let timer = null;

function reload() {
  if (shouldReloadNext) {
    clearInterval(timer);
    timer = setTimeout(() => {
      location.reload();
    }, 10)
  } else {
    shouldReloadNext = true;
  }
}

function liveReload() {
  const url = worker.api ? `${worker.api.replace('http', 'ws')}` : `${location.protocol.replace('http', 'ws')}//${location.host}`
  const socket = new WebSocket(url);
  socket.addEventListener('open', reload);
  socket.addEventListener('close', liveReload);
}

liveReload();