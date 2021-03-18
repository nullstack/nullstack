let shouldReloadNext = false;
let timer = null;

function reload() {
  if(shouldReloadNext) {
    clearInterval(timer);
    timer = setTimeout(() => {
      location.reload()
      console.log('reload');
    }, 10)
  } else {
    shouldReloadNext = true;
  }
}

function liveReload() {
  const socket = new WebSocket('ws://' + location.host);
  socket.addEventListener('open', reload);
  socket.addEventListener('close', liveReload);
}

liveReload();