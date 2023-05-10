export default function setExternalRoute(server) {
  server.get('/external-route.json', (_request, response) => {
    response.json({ nice: 69 })
  })
  server.get('/external-route.json', (_request, response) => {
    response.json({ nicent: 68 })
  })
}
