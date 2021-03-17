import WebSocket from 'ws';

export default function liveReload(server) {

  function noop() {}

  function heartbeat() {
    this.isAlive = true;
  }

  const wss = new WebSocket.Server({server});

  wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', (data) => {
      wss.clients.forEach(function each(client) {
        client.send(data);
      });
    });
  });

  setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);

}