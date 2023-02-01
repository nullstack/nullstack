const { readFileSync } = require('fs')

describe('CatchError initiate', () => {
  test('errors caused by instances can be caught on the server', async () => {
    await page.goto('http://localhost:6969/catch-error?error=initiate')
    const logs = readFileSync('.production/exceptions.txt', 'utf-8')
    expect(logs.includes('this.vaidamerdanoserver is not a function')).toBeTruthy()
  })
})

describe('CatchError initiateServerFunction', () => {
  test('errors caused by server functions can be caught on the server', async () => {
    await page.goto('http://localhost:6969/catch-error?error=initiateServerFunction')
    const logs = readFileSync('.production/exceptions.txt', 'utf-8')
    expect(logs.includes('Panic in the system, someone missconfigured me!')).toBeTruthy()
  })
})

describe('CatchError hydrate', () => {
  test('errors caused by instances can be caught on the client', async () => {
    await page.goto('http://localhost:6969/catch-error?error=hydrate')
    await page.waitForSelector('[data-hydrated]')
    const logs = readFileSync('.production/exceptions.txt', 'utf-8')
    expect(logs.includes('this.vaidamerdanoclient is not a function')).toBeTruthy()
  })
})

describe('CatchError api', () => {
  test('errors caused by api routes can be caught on the server', async () => {
    await page.goto('http://localhost:6969/vaidamerdanaapi.json')
    const logs = readFileSync('.production/exceptions.txt', 'utf-8')
    expect(logs.includes('response.vaidamerdanaapi is not a function')).toBeTruthy()
  })
})
