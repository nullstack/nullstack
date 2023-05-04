function createRequest(url) {
  return {
    method: 'GET',
    host: '',
    cookies: {},
    query: {},
    url,
    headers: {},
  }
}

function createResponse(callback) {
  const res = {
    _removedHeader: {},
    _statusCode: 200,
    statusMessage: 'OK',
    get statusCode() {
      return this._statusCode
    },
    set statusCode(status) {
      this._statusCode = status
      this.status(status)
    },
  }
  const headers = {}
  let code = 200
  res.set = res.header = (x, y) => {
    if (arguments.length === 2) {
      res.setHeader(x, y)
    } else {
      for (const key in x) {
        res.setHeader(key, x[key])
      }
    }
    return res
  }
  res.setHeader = (x, y) => {
    headers[x] = y
    headers[x.toLowerCase()] = y
    return res
  }
  res.getHeader = (x) => headers[x]
  res.redirect = function (_code, url) {
    if (typeof _code !== 'number') {
      code = 301
      url = _code
    } else {
      code = _code
    }
    res.setHeader('Location', url)
    res.end()
  }
  res.status = res.sendStatus = function (number) {
    code = number
    return res
  }
  res.end =
    res.send =
    res.write =
    function (data = '') {
      if (callback) callback(code, data, headers)
    }
  return res
}

export default function emulatePrerender(server) {
  server.prerender = async function prerender(originalUrl) {
    server.start()
    return new Promise((resolve) => {
      server._router.handle(
        createRequest(originalUrl),
        createResponse((code, data) => resolve(data)),
        () => { },
      )
    })
  }
}