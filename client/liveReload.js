let shouldReloadNext = false;

function liveReload() {
  const socket = new WebSocket('ws://' + location.host);
  socket.addEventListener('open', () => {
    shouldReloadNext && location.reload();
    shouldReloadNext = true;
  });
  socket.addEventListener('close', liveReload);
}

liveReload()